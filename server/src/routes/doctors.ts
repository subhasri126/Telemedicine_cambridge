import { Router, Response } from 'express';
import { dbPool } from '../db/index.js';
import { authenticateUser, requireDoctor, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get list of doctors for patients
router.get('/', async (req, res) => {
    try {
        const [doctors]: any = await dbPool.query(
            `SELECT id, full_name as fullName, specialty, qualification, experience_years as experienceYears,
                    hospital_clinic as hospitalClinic, rating, consultation_fee as consultationFee,
                    is_online as isOnline, verification_status as verificationStatus
             FROM doctors
             WHERE verification_status = 'VERIFIED'`
        );
        return res.json(doctors);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch doctors list.' });
    }
});

// Demo verification admin trigger (Hackathon Demo feature)
router.post('/verify/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'VERIFIED' or 'REJECTED'

        const newStatus = status === 'REJECTED' ? 'REJECTED' : 'VERIFIED';

        await dbPool.query(
            'UPDATE doctors SET verification_status = ? WHERE id = ? OR user_id = ?',
            [newStatus, id, id]
        );

        await dbPool.query(
            'UPDATE doctor_documents SET verification_status = ?, verified_at = NOW() WHERE doctor_id = ? OR doctor_id IN (SELECT id FROM doctors WHERE user_id = ?)',
            [newStatus, id, id]
        );

        return res.json({ message: `Doctor status updated to ${newStatus}`, verificationStatus: newStatus });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update doctor verification status.' });
    }
});

// Update online/offline status
router.patch('/status', authenticateUser, requireDoctor, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { isOnline } = req.body;
        const doctorId = req.user?.profileId || req.user?.id;

        await dbPool.query(
            'UPDATE doctors SET is_online = ? WHERE id = ? OR user_id = ?',
            [isOnline ? 1 : 0, doctorId, req.user?.id]
        );

        return res.json({ message: 'Online status updated', isOnline: Boolean(isOnline) });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update online status.' });
    }
});

// Doctor Dashboard Patient Priority Queue
// Priority ranking order: RED (1) -> ORANGE (2) -> YELLOW (3) -> GREEN (4), then oldest waiting_time
router.get('/queue', authenticateUser, requireDoctor, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Query symptom assessments & emergency cases
        const [assessments]: any = await dbPool.query(
            `SELECT sa.id, sa.patient_id as patientId, sa.patient_name as fullName, p.age, p.village as location,
                    sa.symptoms_json as symptoms, sa.vitals_json as vitals, sa.risk_level as riskLevel,
                    sa.created_at as createdAt
             FROM symptom_assessments sa
             LEFT JOIN patients p ON sa.patient_id = p.id
             ORDER BY sa.created_at DESC LIMIT 50`
        );

        const priorityMap: Record<string, number> = {
            'RED': 1,
            'ORANGE': 2,
            'YELLOW': 3,
            'GREEN': 4
        };

        const parsedQueue = assessments.map((item: any) => {
            let syms = [];
            let vit = { spo2Percentage: 98, heartRateBpm: 75 };
            try {
                syms = typeof item.symptoms === 'string' ? JSON.parse(item.symptoms) : item.symptoms;
            } catch (e) { syms = [item.symptoms]; }
            try {
                vit = typeof item.vitals === 'string' ? JSON.parse(item.vitals) : item.vitals;
            } catch (e) { }

            const waitingMinutes = Math.max(1, Math.round((Date.now() - new Date(item.createdAt).getTime()) / 60000));

            return {
                id: item.patientId || item.id,
                assessmentId: item.id,
                fullName: item.fullName || 'Patient',
                age: item.age || 42,
                symptoms: syms || ['General discomfort'],
                vitals: vit,
                riskLevel: item.riskLevel || 'GREEN',
                location: item.location || 'Rural Village',
                waitingMinutes,
                createdAt: item.createdAt,
                priorityScore: priorityMap[item.riskLevel] || 4
            };
        });

        // Sort queue by priority score (1 first) then by waiting time (longest waiting first)
        parsedQueue.sort((a: any, b: any) => {
            if (a.priorityScore !== b.priorityScore) {
                return a.priorityScore - b.priorityScore;
            }
            return b.waitingMinutes - a.waitingMinutes;
        });

        return res.json(parsedQueue);
    } catch (error) {
        console.error('Fetch Doctor Queue Error:', error);
        return res.status(500).json({ error: 'Failed to fetch doctor patient queue.' });
    }
});

export default router;
