import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get patient medicine orders
router.get('/orders', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const patientId = req.user?.profileId || req.user?.id;
        const [orders]: any = await dbPool.query(
            `SELECT id, prescription_id as prescriptionId, patient_name as patientName,
                    pharmacy_name as pharmacyName, delivery_address as deliveryAddress,
                    total_amount as totalAmount, status, estimated_delivery as estimatedDelivery,
                    created_at as createdAt
             FROM medicine_orders WHERE patient_id = ? ORDER BY created_at DESC`,
            [patientId]
        );
        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch medicine orders.' });
    }
});

// Create doorstep medicine order
router.post('/orders', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { prescriptionId, deliveryAddress, totalAmount } = req.body;
        const patientId = req.user?.profileId || req.user?.id;

        const [patients]: any = await dbPool.query('SELECT full_name, village FROM patients WHERE id = ? OR user_id = ?', [patientId, req.user?.id]);
        const patient = patients[0] || {};

        const orderId = `ord-${uuidv4()}`;
        const pharmacyName = 'Kollumangudi Primary Health Pharmacy Center';

        await dbPool.query(
            `INSERT INTO medicine_orders (
                id, prescription_id, patient_id, patient_name, pharmacy_name,
                delivery_address, total_amount, status, estimated_delivery
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested', 'Today by 4:00 PM (ASHA Worker Transport)')`,
            [
                orderId,
                prescriptionId || 'rx-demo-01',
                patientId || 'pat-demo-01',
                patient.full_name || 'Priya Sundaram',
                pharmacyName,
                deliveryAddress || patient.village || 'Kollumangudi Village Health Post',
                Number(totalAmount) || 120.00
            ]
        );

        return res.status(201).json({
            id: orderId,
            status: 'Requested',
            pharmacyName,
            estimatedDelivery: 'Today by 4:00 PM (ASHA Worker Transport)',
            createdAt: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to create medicine order.' });
    }
});

export default router;
