import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';
import { authenticateUser, requireVerifiedDoctor, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get prescriptions for logged in patient or doctor
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.profileId || req.user?.id;
        const role = req.user?.role;

        let query = '';
        if (role === 'patient') {
            query = `SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC`;
        } else {
            query = `SELECT * FROM prescriptions WHERE doctor_id = ? ORDER BY created_at DESC`;
        }

        const [prescriptions]: any = await dbPool.query(query, [userId]);

        // Attach prescription items
        const results = await Promise.all(
            prescriptions.map(async (p: any) => {
                const [items]: any = await dbPool.query(
                    'SELECT id, medicine_name as medicineName, dosage, frequency, duration, instructions FROM prescription_items WHERE prescription_id = ?',
                    [p.id]
                );
                return {
                    id: p.id,
                    consultationId: p.consultation_id,
                    patientId: p.patient_id,
                    patientName: p.patient_name,
                    patientAge: p.patient_age,
                    doctorId: p.doctor_id,
                    doctorName: p.doctor_name,
                    doctorSpecialty: p.doctor_specialty,
                    doctorQualification: p.doctor_qualification || 'MBBS, MD',
                    hospitalName: p.hospital_name || 'District Tele-Health Headquarters',
                    diagnosis: p.diagnosis,
                    adviceNotes: p.advice_notes,
                    validUntil: p.valid_until || '30 Days',
                    createdAt: p.created_at,
                    items
                };
            })
        );

        return res.json(results);
    } catch (error) {
        console.error('Fetch Prescriptions Error:', error);
        return res.status(500).json({ error: 'Failed to fetch prescriptions.' });
    }
});

// Create new Digital Prescription (Doctor only)
router.post('/', authenticateUser, requireVerifiedDoctor, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            consultationId,
            patientId,
            patientName,
            patientAge,
            diagnosis,
            adviceNotes,
            validUntil,
            items
        } = req.body;

        const doctorId = req.user?.profileId || req.user?.id;

        // Fetch doctor info
        const [doctors]: any = await dbPool.query('SELECT * FROM doctors WHERE id = ? OR user_id = ?', [doctorId, req.user?.id]);
        const doctor = doctors[0] || {};

        const prescriptionId = `rx-${uuidv4()}`;

        const connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                `INSERT INTO prescriptions (
                    id, consultation_id, patient_id, patient_name, patient_age,
                    doctor_id, doctor_name, doctor_specialty, doctor_qualification,
                    hospital_name, diagnosis, advice_notes, valid_until
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    prescriptionId,
                    consultationId || null,
                    patientId || 'pat-demo-01',
                    patientName || 'Priya Sundaram',
                    patientAge || 42,
                    doctor.id || doctorId,
                    doctor.full_name || 'Dr. Arun Kumar',
                    doctor.specialty || 'General Medicine',
                    doctor.qualification || 'MBBS, MD',
                    doctor.hospital_clinic || 'District Tele-Health Headquarters',
                    diagnosis || 'Acute Respiratory Infection',
                    adviceNotes || 'Take warm fluids and complete prescribed medication course.',
                    validUntil || '30 Days'
                ]
            );

            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await connection.query(
                        `INSERT INTO prescription_items (
                            id, prescription_id, medicine_name, dosage, frequency, duration, instructions
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            `item-${uuidv4()}`,
                            prescriptionId,
                            item.medicineName || item.name,
                            item.dosage || '500mg',
                            item.frequency || '1-0-1 (After Meals)',
                            item.duration || '5 Days',
                            item.instructions || 'With warm water'
                        ]
                    );
                }
            }

            // Update Care Journey to prescription completed
            await connection.query(
                `UPDATE care_journeys SET prescription = 'completed', medicine_delivery = 'active' WHERE patient_id = ?`,
                [patientId || 'pat-demo-01']
            );

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

        return res.status(201).json({
            id: prescriptionId,
            message: 'Digital prescription issued successfully.',
            createdAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Create Prescription Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to create prescription.' });
    }
});

export default router;
