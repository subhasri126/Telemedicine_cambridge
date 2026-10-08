import { EmergencyCase, EmergencyStatus, HealthVitals } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

export interface CreateEmergencyInput {
    patientId: string;
    patientName: string;
    patientAge: number;
    location: string;
    symptoms: string[];
    vitals: HealthVitals;
    doctorNotes?: string;
}

export function createEmergencySOS(input: CreateEmergencyInput): EmergencyCase {
    const db = getLocalDB();
    const caseNumber = `CB-EMG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: EmergencyCase = {
        id: `emg-${Date.now()}`,
        caseNumber,
        patientId: input.patientId,
        patientName: input.patientName,
        patientAge: input.patientAge,
        location: input.location,
        symptoms: input.symptoms,
        vitals: input.vitals,
        riskLevel: 'RED',
        status: 'SOS Raised',
        etaMinutes: 18,
        assignedDoctorName: 'Dr. Arun Kumar, MD',
        assignedHospitalName: 'District Care Central Hospital',
        assignedTransportCode: 'AMB-TR-104',
        doctorNotes: input.doctorNotes || 'Emergency SOS triggered via CareBridge Mobile Interface.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.emergencyCases.unshift(newCase);

    // Add system notifications
    db.notifications.unshift({
        id: `notif-${Date.now()}-1`,
        recipientRole: 'doctor',
        title: '🚨 CRITICAL SOS ALERT',
        message: `${input.patientName} (${input.location}) triggered SOS. Symptoms: ${input.symptoms.join(', ')}.`,
        type: 'emergency',
        read: false,
        createdAt: new Date().toISOString()
    });

    db.notifications.unshift({
        id: `notif-${Date.now()}-2`,
        recipientRole: 'patient',
        title: 'Emergency SOS Registered',
        message: `Case #${caseNumber} opened. Nearest hospital & Dr. Arun Kumar alerted. Transport assigned.`,
        type: 'emergency',
        read: false,
        createdAt: new Date().toISOString()
    });

    // Update Care Journey to active treatment
    if (db.careJourneys && db.careJourneys.length > 0) {
        db.careJourneys[0].healthAssessment = 'completed';
        db.careJourneys[0].doctorConsultation = 'completed';
        db.careJourneys[0].treatmentDecision = 'active';
    }

    saveLocalDB(db);
    return newCase;
}

export function updateEmergencyStatus(caseId: string, newStatus: EmergencyStatus): EmergencyCase | null {
    const db = getLocalDB();
    const target = db.emergencyCases.find((c: EmergencyCase) => c.id === caseId || c.caseNumber === caseId);
    if (!target) return null;

    target.status = newStatus;
    target.updatedAt = new Date().toISOString();

    if (newStatus === 'Transport Assigned') {
        target.etaMinutes = 14;
    } else if (newStatus === 'Hospital Accepted') {
        target.etaMinutes = 8;
    } else if (newStatus === 'Patient Arrived') {
        target.etaMinutes = 0;
    }

    saveLocalDB(db);
    return target;
}

export function getActiveEmergencyCase(patientId?: string): EmergencyCase | null {
    const db = getLocalDB();
    if (patientId) {
        return db.emergencyCases.find((c: EmergencyCase) => c.patientId === patientId && c.status !== 'Resolved') || null;
    }
    return db.emergencyCases.find((c: EmergencyCase) => c.status !== 'Resolved') || db.emergencyCases[0] || null;
}

export function getAllEmergencyCases(): EmergencyCase[] {
    const db = getLocalDB();
    return db.emergencyCases || [];
}
