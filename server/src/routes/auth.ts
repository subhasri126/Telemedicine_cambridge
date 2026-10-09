import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { dbPool } from '../db/index.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { doctorDocUpload } from '../middleware/upload.js';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'carebridge_rural_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ==========================================
// PATIENT REGISTRATION
// ==========================================
router.post('/patient/register', async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            dateOfBirth,
            gender,
            village,
            district,
            preferredLanguage,
            emergencyContactName,
            emergencyContactPhone,
            telegramChatId
        } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ error: 'Full name, email, phone, and password are required.' });
        }

        // Check if user already exists
        const [existingUsers]: any = await dbPool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = `usr-pat-${uuidv4()}`;
        const patientId = `pat-${uuidv4()}`;

        // Calculate age from Date of Birth
        let age = 30;
        if (dateOfBirth) {
            const birthYear = new Date(dateOfBirth).getFullYear();
            const currentYear = new Date().getFullYear();
            if (!isNaN(birthYear)) age = Math.max(1, currentYear - birthYear);
        }

        const connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert into users
            await connection.query(
                'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [userId, email, passwordHash, 'patient']
            );

            // Insert into patients
            await connection.query(
                `INSERT INTO patients (
                    id, user_id, full_name, email, phone, date_of_birth, age, gender,
                    village, district, preferred_language, emergency_contact_name,
                    emergency_contact_phone, telegram_chat_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    patientId,
                    userId,
                    fullName,
                    email,
                    phone,
                    dateOfBirth || null,
                    age,
                    gender || 'Other',
                    village || 'Rural Village',
                    district || 'Nagapattinam',
                    preferredLanguage || 'English',
                    emergencyContactName || null,
                    emergencyContactPhone || null,
                    telegramChatId || null
                ]
            );

            // Initialize Care Journey
            await connection.query(
                `INSERT INTO care_journeys (id, patient_id) VALUES (?, ?)`,
                [`cj-${uuidv4()}`, patientId]
            );

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

        const token = jwt.sign(
            { id: userId, email, role: 'patient', profileId: patientId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        return res.status(201).json({
            message: 'Patient registered successfully.',
            token,
            user: {
                id: userId,
                profileId: patientId,
                fullName,
                email,
                phone,
                role: 'patient',
                village,
                district,
                preferredLanguage
            }
        });

    } catch (error: any) {
        console.error('Patient Registration Error:', error);
        return res.status(500).json({ error: error.message || 'Registration failed.' });
    }
});

// ==========================================
// PATIENT LOGIN
// ==========================================
router.post('/patient/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const [users]: any = await dbPool.query(
            'SELECT * FROM users WHERE email = ? AND role = ?',
            [email, 'patient']
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Fetch patient profile
        const [patients]: any = await dbPool.query('SELECT * FROM patients WHERE user_id = ?', [user.id]);
        const patient = patients[0] || {};

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'patient', profileId: patient.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        return res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                profileId: patient.id,
                fullName: patient.full_name || 'Patient',
                email: user.email,
                phone: patient.phone,
                role: 'patient',
                age: patient.age,
                gender: patient.gender,
                village: patient.village,
                district: patient.district,
                preferredLanguage: patient.preferred_language
            }
        });
    } catch (error: any) {
        console.error('Patient Login Error:', error);
        return res.status(500).json({ error: 'Login failed.' });
    }
});

// ==========================================
// DOCTOR REGISTRATION
// ==========================================
router.post('/doctor/register', doctorDocUpload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'qualificationCertificate', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
]), async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            specialty,
            qualification,
            medicalRegistrationNumber,
            experienceYears,
            languages,
            hospitalClinic,
            address
        } = req.body;

        if (!fullName || !email || !phone || !password || !specialty || !qualification || !medicalRegistrationNumber) {
            return res.status(400).json({ error: 'All required doctor fields must be provided.' });
        }

        const [existingUsers]: any = await dbPool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = `usr-doc-${uuidv4()}`;
        const doctorId = `doc-${uuidv4()}`;

        const langArr = typeof languages === 'string' ? languages.split(',').map(s => s.trim()) : (languages || ['English', 'Tamil']);

        const connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert into users
            await connection.query(
                'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [userId, email, passwordHash, 'doctor']
            );

            // Insert into doctors (status PENDING)
            await connection.query(
                `INSERT INTO doctors (
                    id, user_id, full_name, email, phone, specialty, qualification,
                    medical_registration_number, experience_years, languages_json,
                    hospital_clinic, address, verification_status, is_online
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 1)`,
                [
                    doctorId,
                    userId,
                    fullName,
                    email,
                    phone,
                    specialty,
                    qualification,
                    medicalRegistrationNumber,
                    Number(experienceYears) || 0,
                    JSON.stringify(langArr),
                    hospitalClinic || 'Rural Tele-Clinic',
                    address || 'District Health Headquarters',
                ]
            );

            // Save documents metadata if uploaded
            if (files) {
                const docTypes = [
                    { key: 'registrationCertificate', type: 'Registration Certificate' },
                    { key: 'qualificationCertificate', type: 'Qualification Certificate' },
                    { key: 'identityProof', type: 'Identity Proof' }
                ];

                for (const item of docTypes) {
                    if (files[item.key] && files[item.key][0]) {
                        const file = files[item.key][0];
                        await connection.query(
                            `INSERT INTO doctor_documents (
                                id, doctor_id, document_type, file_name, file_path, verification_status
                            ) VALUES (?, ?, ?, ?, ?, 'PENDING')`,
                            [
                                `docfile-${uuidv4()}`,
                                doctorId,
                                item.type,
                                file.originalname,
                                file.path.replace(/\\/g, '/')
                            ]
                        );
                    }
                }
            }

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

        const token = jwt.sign(
            { id: userId, email, role: 'doctor', profileId: doctorId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        return res.status(201).json({
            message: 'Doctor registered successfully. Account credentials are under verification.',
            verificationStatus: 'PENDING',
            token,
            user: {
                id: userId,
                profileId: doctorId,
                fullName,
                email,
                role: 'doctor',
                specialty,
                verificationStatus: 'PENDING'
            }
        });

    } catch (error: any) {
        console.error('Doctor Registration Error:', error);
        return res.status(500).json({ error: error.message || 'Doctor registration failed.' });
    }
});

// ==========================================
// DOCTOR LOGIN
// ==========================================
router.post('/doctor/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const [users]: any = await dbPool.query(
            'SELECT * FROM users WHERE email = ? AND role = ?',
            [email, 'doctor']
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const [doctors]: any = await dbPool.query('SELECT * FROM doctors WHERE user_id = ?', [user.id]);
        const doctor = doctors[0] || {};

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'doctor', profileId: doctor.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        return res.json({
            message: 'Doctor login successful.',
            token,
            user: {
                id: user.id,
                profileId: doctor.id,
                fullName: doctor.full_name || 'Doctor',
                email: user.email,
                phone: doctor.phone,
                role: 'doctor',
                specialty: doctor.specialty,
                qualification: doctor.qualification,
                medicalRegistrationNumber: doctor.medical_registration_number,
                verificationStatus: doctor.verification_status || 'PENDING',
                isOnline: Boolean(doctor.is_online)
            }
        });
    } catch (error: any) {
        console.error('Doctor Login Error:', error);
        return res.status(500).json({ error: 'Doctor login failed.' });
    }
});

// ==========================================
// GET CURRENT USER (/api/auth/me)
// ==========================================
router.get('/me', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated.' });

        const { id, role } = req.user;

        if (role === 'patient') {
            const [patients]: any = await dbPool.query('SELECT * FROM patients WHERE user_id = ?', [id]);
            if (patients.length === 0) return res.status(404).json({ error: 'Patient profile not found.' });

            const p = patients[0];
            return res.json({
                id,
                profileId: p.id,
                fullName: p.full_name,
                email: p.email,
                phone: p.phone,
                role: 'patient',
                dateOfBirth: p.date_of_birth,
                age: p.age,
                gender: p.gender,
                village: p.village,
                district: p.district,
                preferredLanguage: p.preferred_language,
                emergencyContactName: p.emergency_contact_name,
                emergencyContactPhone: p.emergency_contact_phone,
                telegramChatId: p.telegram_chat_id
            });
        } else if (role === 'doctor') {
            const [doctors]: any = await dbPool.query('SELECT * FROM doctors WHERE user_id = ?', [id]);
            if (doctors.length === 0) return res.status(404).json({ error: 'Doctor profile not found.' });

            const d = doctors[0];
            return res.json({
                id,
                profileId: d.id,
                fullName: d.full_name,
                email: d.email,
                phone: d.phone,
                role: 'doctor',
                specialty: d.specialty,
                qualification: d.qualification,
                medicalRegistrationNumber: d.medical_registration_number,
                experienceYears: d.experience_years,
                verificationStatus: d.verification_status,
                isOnline: Boolean(d.is_online),
                hospitalClinic: d.hospital_clinic,
                address: d.address
            });
        }

        return res.status(400).json({ error: 'Unknown role.' });
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to retrieve user profile.' });
    }
});

export default router;
