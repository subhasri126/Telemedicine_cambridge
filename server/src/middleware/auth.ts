import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { dbPool } from '../db/index.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'carebridge_rural_super_secret_jwt_key_2026';

export interface UserPayload {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    profileId?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

export async function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

export function requirePatient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user || req.user.role !== 'patient') {
        return res.status(403).json({ error: 'Access denied. Patient role required.' });
    }
    next();
}

export function requireDoctor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Access denied. Doctor role required.' });
    }
    next();
}

export async function requireVerifiedDoctor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Access denied. Doctor role required.' });
    }

    try {
        const [rows]: any = await dbPool.query(
            'SELECT verification_status FROM doctors WHERE user_id = ? OR id = ?',
            [req.user.id, req.user.profileId || req.user.id]
        );

        if (rows.length === 0 || rows[0].verification_status !== 'VERIFIED') {
            return res.status(403).json({
                error: 'Your credentials are under verification. Access restricted until verified by CareBridge clinical administration.',
                verification_status: rows.length > 0 ? rows[0].verification_status : 'PENDING'
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Failed to verify doctor status.' });
    }
}
