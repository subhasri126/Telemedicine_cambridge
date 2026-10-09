import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';

export type SmsStatus = 'pending' | 'submitted' | 'failed' | 'delivered';
export type SmsMode = 'demo' | 'twilio';

interface SmsRecipient {
    role: 'emergency_contact' | 'hospital';
    phone: string;
}

interface EmergencySmsDetails {
    caseId: string;
    caseNumber: string;
    patientName: string;
    location: string;
    symptoms: string[];
}

function getSmsMode(): SmsMode {
    return process.env.SMS_MODE === 'twilio' ? 'twilio' : 'demo';
}

function getTwilioConfigurationError() {
    const missing = [
        !process.env.TWILIO_ACCOUNT_SID && 'TWILIO_ACCOUNT_SID',
        !process.env.TWILIO_AUTH_TOKEN && 'TWILIO_AUTH_TOKEN',
        !process.env.TWILIO_FROM_NUMBER && 'TWILIO_FROM_NUMBER'
    ].filter(Boolean);
    if (missing.length > 0) {
        return `Twilio SMS mode is not configured. Missing: ${missing.join(', ')}.`;
    }
    if (!/^\+[1-9]\d{7,14}$/.test(process.env.TWILIO_FROM_NUMBER!)) {
        return 'Twilio SMS mode requires TWILIO_FROM_NUMBER in E.164 format.';
    }
    return null;
}

function normalizePhone(phone: string) {
    return phone.trim().replace(/[^\d+]/g, '');
}

function buildEmergencyMessage(details: EmergencySmsDetails, simulated: boolean) {
    const prefix = simulated ? 'SIMULATED — no real SMS sent. ' : '';
    return `${prefix}CAREBRIDGE EMERGENCY ${details.caseNumber}: ${details.patientName} needs assistance. Location: ${details.location}. Symptoms: ${details.symptoms.join(', ')}. Reply to this SMS for the emergency team.`;
}

async function submitWithTwilio(to: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_FROM_NUMBER!;
    const params = new URLSearchParams({ To: to, From: from, Body: body });
    const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        }
    );

    const data = await response.json() as { sid?: string; message?: string; code?: number };
    if (!response.ok || !data.sid) {
        throw new Error(data.message || `SMS provider rejected the request (${data.code || response.status})`);
    }
    return data.sid;
}

async function dispatchMessage(messageId: string, to: string, body: string) {
    const mode = getSmsMode();
    if (mode === 'demo') {
        await dbPool.query(
            'UPDATE emergency_sms_messages SET status = ?, failure_reason = ? WHERE id = ?',
            ['submitted', 'SIMULATED — no real SMS sent', messageId]
        );
        return {
            status: 'submitted' as const,
            simulated: true,
            realSmsSent: false,
            reason: 'SIMULATED — no real SMS sent'
        };
    }

    const configurationError = getTwilioConfigurationError();
    if (configurationError) {
        await dbPool.query(
            'UPDATE emergency_sms_messages SET status = ?, failure_reason = ? WHERE id = ?',
            ['failed', configurationError, messageId]
        );
        return { status: 'failed' as const, simulated: false, realSmsSent: false, reason: configurationError };
    }

    try {
        const providerMessageId = await submitWithTwilio(to, body);
        await dbPool.query(
            'UPDATE emergency_sms_messages SET status = ?, provider_message_id = ? WHERE id = ?',
            ['submitted', providerMessageId, messageId]
        );
        return { status: 'submitted' as const, simulated: false, realSmsSent: true, providerMessageId };
    } catch (error) {
        const reason = error instanceof Error ? error.message : 'SMS provider request failed.';
        await dbPool.query(
            'UPDATE emergency_sms_messages SET status = ?, failure_reason = ? WHERE id = ?',
            ['failed', reason.slice(0, 255), messageId]
        );
        return { status: 'failed' as const, simulated: false, realSmsSent: false, reason };
    }
}

export async function sendEmergencySmsAlerts(details: EmergencySmsDetails, recipients: SmsRecipient[]) {
    const simulated = getSmsMode() === 'demo';
    const body = buildEmergencyMessage(details, simulated);
    const results = [];

    for (const recipient of recipients) {
        const phone = normalizePhone(recipient.phone);
        if (!phone) continue;

        const id = `sms-${uuidv4()}`;
        await dbPool.query(
            `INSERT INTO emergency_sms_messages
                (id, emergency_case_id, recipient_role, recipient_phone, message, provider, status)
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [id, details.caseId, recipient.role, phone, body, getSmsMode()]
        );
        results.push({
            id,
            recipientRole: recipient.role,
            recipientPhone: phone,
            ...(await dispatchMessage(id, phone, body))
        });
    }

    return results;
}

export async function updateSmsStatus(providerMessageId: string, status: SmsStatus, reason?: string) {
    if (status === 'delivered') {
        const [rows]: any = await dbPool.query(
            'SELECT provider FROM emergency_sms_messages WHERE provider_message_id = ? LIMIT 1',
            [providerMessageId]
        );
        if (!rows[0] || rows[0].provider !== 'twilio') return;
    }
    await dbPool.query(
        `UPDATE emergency_sms_messages
         SET status = ?, failure_reason = COALESCE(?, failure_reason)
         WHERE provider_message_id = ?`,
        [status, reason || null, providerMessageId]
    );
}

export async function listEmergencySms(caseId: string) {
    const [messages]: any = await dbPool.query(
        `SELECT id, recipient_role AS recipientRole, recipient_phone AS recipientPhone,
                status, failure_reason AS failureReason, provider_message_id AS providerMessageId,
                created_at AS createdAt, updated_at AS updatedAt
         FROM emergency_sms_messages WHERE emergency_case_id = ? ORDER BY created_at ASC`,
        [caseId]
    );
    const [replies]: any = await dbPool.query(
        `SELECT id, sender_phone AS senderPhone, message, provider_message_id AS providerMessageId,
                received_at AS receivedAt
         FROM emergency_sms_replies WHERE emergency_case_id = ? ORDER BY received_at ASC`,
        [caseId]
    );
    return { messages, replies };
}

export { buildEmergencyMessage, getSmsMode, getTwilioConfigurationError, normalizePhone };
