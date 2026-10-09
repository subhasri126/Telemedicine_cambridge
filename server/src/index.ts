import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { ensureEmergencySmsTables, testDbConnection } from './db/index.js';
import { setupSocketIO } from './socket.js';

import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';
import triageRoutes from './routes/triage.js';
import consultationRoutes from './routes/consultations.js';
import chatRoutes from './routes/chat.js';
import prescriptionRoutes from './routes/prescriptions.js';
import pharmacyRoutes from './routes/pharmacy.js';
import emergencyRoutes from './routes/emergency.js';
import aiRoutes from './routes/ai.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const PORT = Number(process.env.PORT) || 5000;

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CareBridge Rural API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai', aiRoutes);

// Initialize Realtime Signaling & Chat Server
setupSocketIO(server);

// Start Server
async function startServer() {
    const isDbConnected = await testDbConnection();
    if (isDbConnected) {
        await ensureEmergencySmsTables();
        await seedDatabase();
    } else {
        console.warn('⚠️ Warning: MySQL database connection failed. Please check MySQL service.');
    }

    server.listen(PORT, () => {
        console.log(`🚀 CareBridge Rural Backend Server running on http://localhost:${PORT}`);
    });
}

startServer();
