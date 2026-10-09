import { Router, Response } from 'express';
import { dbPool } from '../db/index.js';
import { authenticateUser, requirePatient, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get patient profile
router.get('/profile', authenticateUser, requirePatient, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const [patients]: any = await dbPool.query('SELECT * FROM patients WHERE user_id = ? OR id = ?', [userId, req.user?.profileId]);
        if (patients.length === 0) return res.status(404).json({ error: 'Patient profile not found.' });

        const p = patients[0];
        return res.json({
            id: p.id,
            fullName: p.full_name,
            email: p.email,
            phone: p.phone,
            dateOfBirth: p.date_of_birth,
            age: p.age,
            gender: p.gender,
            village: p.village,
            district: p.district,
            preferredLanguage: p.preferred_language,
            emergencyContactName: p.emergency_contact_name,
            emergencyContactPhone: p.emergency_contact_phone,
            telegramChatId: p.telegram_chat_id,
            bloodGroup: p.blood_group
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch patient profile.' });
    }
});

// Get care journey
router.get('/care-journey', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const patientId = req.user?.profileId || req.user?.id || 'patient-priya-01';
        const [rows]: any = await dbPool.query('SELECT * FROM care_journeys WHERE patient_id = ?', [patientId]);

        if (rows.length === 0) {
            return res.json({
                patientId,
                healthAssessment: 'completed',
                doctorConsultation: 'active',
                treatmentDecision: 'pending',
                prescription: 'pending',
                medicineDelivery: 'pending',
                followup: 'pending'
            });
        }

        const cj = rows[0];
        return res.json({
            patientId: cj.patient_id,
            healthAssessment: cj.health_assessment,
            doctorConsultation: cj.doctor_consultation,
            treatmentDecision: cj.treatment_decision,
            prescription: cj.prescription,
            medicineDelivery: cj.medicine_delivery,
            followup: cj.followup
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch care journey.' });
    }
});

export default router;
