import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest, requireVerifiedDoctor } from '../middleware/auth.js';
import { getSmsMode, listEmergencySms, sendEmergencySmsAlerts, updateSmsStatus } from '../services/sms.js';

dotenv.config();
const router = Router();
const recentSosByUser = new Map<string, number>();

// Send Telegram Emergency Notification if token and chat ID are set
async function sendTelegramEmergencyAlert(chatId: string, caseDetails: any): Promise<{ sent: boolean; reason: string }> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || !chatId) {
        return { sent: false, reason: 'Telegram token or chat ID not configured' };
    }

    const message = `🚨 *CAREBRIDGE EMERGENCY ALERT* 🚨

*Patient:* ${caseDetails.patientName}
*Risk:* ${caseDetails.riskLevel} / HIGH PRIORITY
*Condition:* ${caseDetails.condition}
*SpO2:* ${caseDetails.spo2 || 'N/A'}%
*Case:* ${caseDetails.caseNumber}
*Location:* ${caseDetails.location}
*Time:* ${new Date().toLocaleTimeString()}

*Action Required:* Doctor triage alert and emergency transport dispatched.`;

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data: any = await res.json();
        if (data.ok) {
            return { sent: true, reason: '' };
        } else {
            console.warn('Telegram API warning:', data);
            return { sent: false, reason: data.description };
        }
    } catch (err: any) {
        console.error('Telegram dispatch error:', err);
        return { sent: false, reason: err.message };
    }
}

// Generate unique Case Number e.g. CBR-261009-1042
function generateCaseNumber(): string {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `CBR-${dateStr}-${randomDigits}`;
}

// Trigger Emergency SOS Case
router.post('/sos', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.role !== 'patient') {
            return res.status(403).json({ error: 'Only authenticated patients can raise an SOS.' });
        }

        const lastSosAt = recentSosByUser.get(req.user.id) || 0;
        if (Date.now() - lastSosAt < 30_000) {
            return res.status(429).json({ error: 'Please wait before submitting another emergency alert.' });
        }

        const { symptoms, vitals, location, riskLevel } = req.body;
        const patientId = req.user?.profileId || req.user?.id;

        // Fetch patient data
        const [patients]: any = await dbPool.query('SELECT * FROM patients WHERE id = ? OR user_id = ?', [patientId, req.user?.id]);
        const patient = patients[0] || {};

        const [activeCases]: any = await dbPool.query(
            `SELECT id, case_number AS caseNumber, status
             FROM emergency_cases
             WHERE patient_id = ? AND status <> 'Resolved'
             ORDER BY created_at DESC LIMIT 1`,
            [patient.id || patientId]
        );
        if (activeCases.length > 0) {
            return res.status(409).json({
                error: 'An active emergency case already exists for this patient.',
                emergencyCase: activeCases[0]
            });
        }

        const caseNumber = generateCaseNumber();
        const caseId = `case-${uuidv4()}`;

        const symsList = symptoms || ['Breathing difficulty', 'Chest tightness'];
        const vitalsObj = vitals || { spo2Percentage: 89, heartRateBpm: 112 };
        const loc = location || patient.village || 'Kollumangudi Village Health Post';
        const rLevel = riskLevel || 'RED';

        await dbPool.query(
            `INSERT INTO emergency_cases (
                id, case_number, patient_id, patient_name, patient_age, location,
                symptoms_json, vitals_json, risk_level, status, eta_minutes,
                assigned_hospital_name, assigned_transport_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SOS Raised', 18, 'Mayiladuthurai District Govt Hospital', 'TR-104')`,
            [
                caseId,
                caseNumber,
                patient.id || patientId,
                patient.full_name || 'Priya Sundaram',
                patient.age || 42,
                loc,
                JSON.stringify(symsList),
                JSON.stringify(vitalsObj),
                rLevel
            ]
        );
        recentSosByUser.set(req.user.id, Date.now());

        const [hospitalRows]: any = await dbPool.query(
            `SELECT contact_phone AS contactPhone
             FROM hospitals
             WHERE has_emergency_unit = 1 AND contact_phone IS NOT NULL
             ORDER BY available_beds DESC LIMIT 1`
        );
        const smsRecipients = [];
        if (patient.emergency_contact_phone) {
            smsRecipients.push({ role: 'emergency_contact' as const, phone: patient.emergency_contact_phone });
        }
        if (hospitalRows[0]?.contactPhone) {
            smsRecipients.push({ role: 'hospital' as const, phone: hospitalRows[0].contactPhone });
        }
        const smsResults = await sendEmergencySmsAlerts({
            caseId,
            caseNumber,
            patientName: patient.full_name || 'Patient',
            location: loc,
            symptoms: symsList
        }, smsRecipients);
        const hasSmsFailure = smsResults.some((sms) => sms.status === 'failed');
        const realSmsSent = smsResults.some((sms) => sms.realSmsSent === true);
        await dbPool.query(
            `INSERT INTO emergency_notifications
                (id, emergency_case_id, recipient_role, channel, title, message, is_read)
             VALUES (?, ?, 'doctor', 'in_app', ?, ?, 0)`,
            [
                `notif-${uuidv4()}`,
                caseId,
                hasSmsFailure ? 'Emergency SOS — in-app fallback active' : 'Emergency SOS Alert',
                hasSmsFailure
                    ? `Case ${caseNumber} is active. SMS was not sent; review the emergency queue.`
                    : `Case ${caseNumber} is active at ${loc}.`
            ]
        );

        // Attempt Telegram alert if user has telegram_chat_id or bot token exists
        let telegramResult: { sent: boolean; reason: string } = { sent: false, reason: 'Telegram bot token not provided in environment.' };
        if (patient.telegram_chat_id || process.env.TELEGRAM_BOT_TOKEN) {
            telegramResult = await sendTelegramEmergencyAlert(
                patient.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || '',
                {
                    patientName: patient.full_name || 'Priya Sundaram',
                    riskLevel: rLevel,
                    condition: symsList.join(', '),
                    spo2: vitalsObj.spo2Percentage,
                    caseNumber,
                    location: loc
                }
            );
        }

        // Notification message status string
        const notificationStatusText = getSmsMode() === 'demo'
            ? 'Emergency case persisted. SIMULATED — no real SMS sent.'
            : hasSmsFailure
                ? 'SMS configuration/provider failed. In-app emergency notification preserved.'
                : realSmsSent
                    ? 'Emergency SMS submitted to the configured provider.'
                    : 'In-app emergency notification sent.';

        return res.status(201).json({
            id: caseId,
            caseNumber,
            patientName: patient.full_name || 'Priya Sundaram',
            location: loc,
            symptoms: symsList,
            vitals: vitalsObj,
            riskLevel: rLevel,
            status: 'SOS Raised',
            etaMinutes: 18,
            assignedTransportCode: 'TR-104',
            assignedHospitalName: 'Mayiladuthurai District Govt Hospital',
            notificationStatus: notificationStatusText,
            telegramSent: telegramResult.sent,
            sms: smsResults,
            smsMode: getSmsMode(),
            realSmsSent,
            duplicateAlertPrevented: false,
            createdAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Emergency SOS Error:', error);
        return res.status(500).json({ error: 'Failed to dispatch emergency SOS case.' });
    }
});

router.post('/sms/status', async (req: Request, res: Response) => {
    const signature = req.headers['x-carebridge-webhook-secret'];
    if (!process.env.SMS_WEBHOOK_SECRET || signature !== process.env.SMS_WEBHOOK_SECRET) {
        return res.status(401).json({ error: 'Invalid SMS webhook credentials.' });
    }

    const { MessageSid, MessageStatus, ErrorMessage } = req.body;
    const statusMap: Record<string, 'submitted' | 'failed' | 'delivered'> = {
        queued: 'submitted',
        accepted: 'submitted',
        sent: 'submitted',
        delivered: 'delivered',
        failed: 'failed',
        undelivered: 'failed'
    };
    const status = statusMap[MessageStatus];
    if (!MessageSid || !status) return res.status(400).json({ error: 'Unsupported SMS status callback.' });
    await updateSmsStatus(MessageSid, status, ErrorMessage);
    return res.sendStatus(204);
});

router.post('/sms/inbound', async (req: Request, res: Response) => {
    const signature = req.headers['x-carebridge-webhook-secret'];
    if (!process.env.SMS_WEBHOOK_SECRET || signature !== process.env.SMS_WEBHOOK_SECRET) {
        return res.status(401).json({ error: 'Invalid SMS webhook credentials.' });
    }

    const senderPhone = String(req.body.From || '').trim();
    const message = String(req.body.Body || '').trim();
    const providerMessageId = req.body.MessageSid ? String(req.body.MessageSid) : null;
    if (!senderPhone || !message) return res.status(400).json({ error: 'Inbound SMS sender and body are required.' });

    const [matches]: any = await dbPool.query(
        `SELECT m.emergency_case_id AS caseId
         FROM emergency_sms_messages m
         JOIN emergency_cases c ON c.id = m.emergency_case_id
         WHERE m.recipient_phone = ? AND c.status <> 'Resolved'
         ORDER BY m.created_at DESC LIMIT 1`,
        [senderPhone]
    );
    if (!matches[0]) return res.status(403).json({ error: 'Sender is not authorized for an active emergency case.' });

    await dbPool.query(
        `INSERT INTO emergency_sms_replies
            (id, emergency_case_id, sender_phone, message, provider_message_id)
         VALUES (?, ?, ?, ?, ?)`,
        [`reply-${uuidv4()}`, matches[0].caseId, senderPhone, message, providerMessageId]
    );
    return res.sendStatus(204);
});

// Fetch active Emergency Cases
router.get('/cases', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const [cases]: any = await dbPool.query(
            `SELECT id, case_number as caseNumber, patient_id as patientId, patient_name as patientName,
                    patient_age as patientAge, location, symptoms_json as symptoms, vitals_json as vitals,
                    risk_level as riskLevel, status, eta_minutes as etaMinutes,
                    assigned_doctor_name as assignedDoctorName, assigned_hospital_name as assignedHospitalName,
                    assigned_transport_code as assignedTransportCode, created_at as createdAt
             FROM emergency_cases ORDER BY created_at DESC LIMIT 20`
        );

        const parsed = cases.map((c: any) => ({
            ...c,
            symptoms: typeof c.symptoms === 'string' ? JSON.parse(c.symptoms) : c.symptoms,
            vitals: typeof c.vitals === 'string' ? JSON.parse(c.vitals) : c.vitals
        }));

        return res.json(parsed);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch emergency cases.' });
    }
});

router.get('/cases/:id/sms', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const [cases]: any = await dbPool.query(
            `SELECT id, patient_id AS patientId FROM emergency_cases WHERE id = ? OR case_number = ? LIMIT 1`,
            [req.params.id, req.params.id]
        );
        if (!cases[0]) return res.status(404).json({ error: 'Emergency case not found.' });
        if (req.user?.role === 'patient' && cases[0].patientId !== (req.user.profileId || req.user.id)) {
            return res.status(403).json({ error: 'Access denied for this emergency case.' });
        }
        return res.json(await listEmergencySms(cases[0].id));
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch emergency SMS messages.' });
    }
});

router.post('/cases/:id/sms/reply', authenticateUser, requireVerifiedDoctor, async (req: AuthenticatedRequest, res: Response) => {
    const message = String(req.body.message || '').trim();
    if (!message || message.length > 480) return res.status(400).json({ error: 'Reply must be between 1 and 480 characters.' });
    try {
        const [cases]: any = await dbPool.query(
            `SELECT id, patient_id AS patientId FROM emergency_cases WHERE id = ? OR case_number = ? LIMIT 1`,
            [req.params.id, req.params.id]
        );
        if (!cases[0]) return res.status(404).json({ error: 'Emergency case not found.' });
        const [contacts]: any = await dbPool.query(
            `SELECT emergency_contact_phone AS phone FROM patients WHERE id = ? LIMIT 1`,
            [cases[0].patientId]
        );
        if (!contacts[0]?.phone) return res.status(409).json({ error: 'No verified emergency contact is available.' });

        const smsResults = await sendEmergencySmsAlerts({
            caseId: cases[0].id,
            caseNumber: String(req.params.id),
            patientName: 'CareBridge emergency team',
            location: 'Emergency case',
            symptoms: [message]
        }, [{ role: 'emergency_contact', phone: contacts[0].phone }]);
        return res.status(201).json({ sms: smsResults });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send emergency reply.' });
    }
});

// Update SOS Pipeline Status
router.patch('/cases/:id/status', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            'SOS Raised',
            'Doctor Alerted',
            'Hospital Notified',
            'Transport Assigned',
            'Hospital Accepted',
            'Patient Arrived',
            'Resolved'
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid emergency case status.' });
        }

        await dbPool.query(
            'UPDATE emergency_cases SET status = ?, updated_at = NOW() WHERE id = ? OR case_number = ?',
            [status, id, id]
        );

        return res.json({ message: `Status updated to ${status}`, status });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update emergency case status.' });
    }
});

export default router;
