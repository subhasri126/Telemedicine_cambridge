import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Create/request new WebRTC consultation room
router.post('/request', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { doctorId, mode } = req.body;
        const patientId = req.user?.profileId || req.user?.id || 'pat-demo-01';

        // Generate unique Room ID e.g. CBR-ROOM-82931
        const roomId = `CBR-ROOM-${Math.floor(10000 + Math.random() * 90000)}`;
        const consultationId = `consult-${uuidv4()}`;

        // Find doctor or assign default demo doctor
        let docId = doctorId;
        if (!docId) {
            const [docs]: any = await dbPool.query("SELECT id FROM doctors WHERE verification_status = 'VERIFIED' LIMIT 1");
            if (docs.length > 0) docId = docs[0].id;
            else docId = 'doc-arun-01';
        }

        await dbPool.query(
            `INSERT INTO consultations (
                id, room_id, patient_id, doctor_id, mode, status, network_mode
            ) VALUES (?, ?, ?, ?, ?, 'requested', 'Good')`,
            [consultationId, roomId, patientId, docId, mode || 'video']
        );

        return res.status(201).json({
            id: consultationId,
            roomId,
            patientId,
            doctorId: docId,
            mode: mode || 'video',
            status: 'requested',
            createdAt: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Create Consultation Error:', error);
        return res.status(500).json({ error: 'Failed to request consultation.' });
    }
});

// Fetch Active Consultations
router.get('/active', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.profileId || req.user?.id;
        const role = req.user?.role;

        let query = '';
        if (role === 'patient') {
            query = `SELECT c.*, d.full_name as doctorName, d.specialty as doctorSpecialty
                     FROM consultations c
                     JOIN doctors d ON c.doctor_id = d.id
                     WHERE c.patient_id = ? AND c.status IN ('requested', 'ringing', 'connected')
                     ORDER BY c.created_at DESC LIMIT 1`;
        } else {
            query = `SELECT c.*, p.full_name as patientName, p.age as patientAge
                     FROM consultations c
                     JOIN patients p ON c.patient_id = p.id
                     WHERE c.doctor_id = ? AND c.status IN ('requested', 'ringing', 'connected')
                     ORDER BY c.created_at DESC LIMIT 1`;
        }

        const [rows]: any = await dbPool.query(query, [userId]);
        if (rows.length === 0) {
            return res.json(null);
        }

        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch active consultation.' });
    }
});

// End Consultation
router.post('/:id/end', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        await dbPool.query(
            "UPDATE consultations SET status = 'completed', ended_at = NOW() WHERE id = ? OR room_id = ?",
            [id, id]
        );
        return res.json({ message: 'Consultation ended.', status: 'completed' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to end consultation.' });
    }
});

export default router;
