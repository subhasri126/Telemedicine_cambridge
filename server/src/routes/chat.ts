import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get or create conversation between patient and doctor
router.post('/conversations', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { doctorId, patientId } = req.body;
        const currentProfileId = req.user?.profileId || req.user?.id;

        const pId = patientId || (req.user?.role === 'patient' ? currentProfileId : 'pat-demo-01');
        const dId = doctorId || (req.user?.role === 'doctor' ? currentProfileId : 'doc-arun-01');

        const [existing]: any = await dbPool.query(
            'SELECT * FROM conversations WHERE patient_id = ? AND doctor_id = ?',
            [pId, dId]
        );

        if (existing.length > 0) {
            return res.json(existing[0]);
        }

        const convId = `conv-${uuidv4()}`;
        await dbPool.query(
            'INSERT INTO conversations (id, patient_id, doctor_id) VALUES (?, ?, ?)',
            [convId, pId, dId]
        );

        return res.status(201).json({ id: convId, patient_id: pId, doctor_id: dId });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create conversation.' });
    }
});

// Fetch messages for a conversation
router.get('/messages/:conversationId', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { conversationId } = req.params;
        const [messages]: any = await dbPool.query(
            `SELECT id, conversation_id as conversationId, sender_id as senderId,
                    receiver_id as receiverId, message, sent_at as sentAt, read_at as readAt
             FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`,
            [conversationId]
        );
        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Post a new message
router.post('/messages', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { conversationId, receiverId, message } = req.body;
        const senderId = req.user?.profileId || req.user?.id;

        if (!conversationId || !receiverId || !message) {
            return res.status(400).json({ error: 'conversationId, receiverId, and message are required.' });
        }

        const msgId = `msg-${uuidv4()}`;
        await dbPool.query(
            `INSERT INTO messages (id, conversation_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?, ?)`,
            [msgId, conversationId, senderId, receiverId, message]
        );

        return res.status(201).json({
            id: msgId,
            conversationId,
            senderId,
            receiverId,
            message,
            sentAt: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send message.' });
    }
});

export default router;
