import { DoctorProfile } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

export function getDoctorsList(): DoctorProfile[] {
    const db = getLocalDB();
    return db.doctors || [];
}

export function searchDoctors(query?: string, specialty?: string): DoctorProfile[] {
    const doctors = getDoctorsList();
    return doctors.filter((doc) => {
        const matchesQuery = !query ||
            doc.fullName.toLowerCase().includes(query.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(query.toLowerCase());
        const matchesSpecialty = !specialty || specialty === 'All' || doc.specialty === specialty;
        return matchesQuery && matchesSpecialty;
    });
}

export function recommendBestDoctor(symptoms: string[]): DoctorProfile | null {
    const doctors = getDoctorsList();
    if (doctors.length === 0) return null;

    const lowerSymptoms = symptoms.map((s) => s.toLowerCase()).join(' ');

    if (lowerSymptoms.includes('child') || lowerSymptoms.includes('baby') || lowerSymptoms.includes('pediatric')) {
        const peds = doctors.find((d) => d.specialty.includes('Pediatrics'));
        if (peds) return peds;
    }

    if (lowerSymptoms.includes('chest') || lowerSymptoms.includes('heart') || lowerSymptoms.includes('pulse')) {
        const cardio = doctors.find((d) => d.specialty.includes('Cardiology'));
        if (cardio) return cardio;
    }

    // Default to Dr. Arun (General Medicine & Critical Care)
    return doctors[0];
}

export function getDoctorQueue(): any[] {
    const db = getLocalDB();
    const assessments = db.assessments || [];
    if (assessments.length > 0) {
        return assessments.map((a: any) => ({
            id: a.patientId || 'patient-priya-01',
            fullName: a.patientName || 'Priya Sundaram',
            age: 42,
            symptoms: a.symptoms || ['Chest Tightness', 'Shortness of Breath'],
            vitals: a.vitals || { spo2Percentage: 89, heartRateBpm: 112 },
            riskLevel: a.riskLevel || 'RED',
            location: 'Kollumangudi Village'
        }));
    }

    return [
        {
            id: 'patient-priya-01',
            fullName: 'Priya Sundaram',
            age: 42,
            symptoms: ['Chest Tightness', 'Shortness of Breath', 'High Fever'],
            vitals: { spo2Percentage: 89, heartRateBpm: 112 },
            riskLevel: 'RED',
            location: 'Kollumangudi Village'
        },
        {
            id: 'patient-murugan-02',
            fullName: 'Murugan K.',
            age: 58,
            symptoms: ['Joint Stiffness', 'Mild Fever'],
            vitals: { spo2Percentage: 96, heartRateBpm: 78 },
            riskLevel: 'YELLOW',
            location: 'Mayiladuthurai Town'
        }
    ];
}

export function updateDoctorStatus(doctorId: string, isOnline: boolean): void {
    const db = getLocalDB();
    const doc = db.doctors.find((d: any) => d.id === doctorId);
    if (doc) {
        doc.isOnline = isOnline;
        doc.isAvailable = isOnline;
        saveLocalDB(db);
    }
}
