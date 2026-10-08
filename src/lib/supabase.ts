import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Local persistent storage key for demo/offline fallback
const DB_STORAGE_KEY = 'carebridge_rural_db_v1';

// Seed state for immediate evaluation
export const INITIAL_DEMO_DATA = {
    patients: [
        {
            id: 'patient-priya-01',
            profileId: 'profile-priya',
            fullName: 'Priya Sundaram',
            email: 'priya@ruralhealth.org',
            age: 42,
            gender: 'Female',
            bloodGroup: 'O+',
            location: 'Kollumangudi Health Centre, Thanjavur District',
            medicalHistory: ['Asthma (Mild)', 'Seasonal Allergies'],
            currentMedications: ['Salbutamol Inhaler as needed'],
            emergencyContact: {
                name: 'Lakshmi Sundaram',
                phone: '+91 98765 43210',
                relation: 'Mother'
            }
        }
    ],
    doctors: [
        {
            id: 'doctor-arun-01',
            profileId: 'profile-arun',
            fullName: 'Dr. Arun Kumar, MD',
            specialty: 'General Medicine & Critical Care',
            qualification: 'MBBS, MD (General Medicine) - AIIMS',
            experienceYears: 12,
            languages: ['English', 'Tamil'],
            isAvailable: true,
            rating: 4.9,
            currentQueueCount: 1,
            hospitalAffiliation: 'District Care Central Hospital',
            consultationFee: 0,
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'doctor-meena-02',
            profileId: 'profile-meena',
            fullName: 'Dr. Meena Ramesh, DCH',
            specialty: 'Pediatrics & Rural Child Care',
            qualification: 'MBBS, DCH - MMC Chennai',
            experienceYears: 9,
            languages: ['English', 'Tamil'],
            isAvailable: true,
            rating: 4.8,
            currentQueueCount: 0,
            hospitalAffiliation: 'Sub-District Rural Health Mission',
            consultationFee: 0,
            avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce75907?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'doctor-venkat-03',
            profileId: 'profile-venkat',
            fullName: 'Dr. R. Venkatraman, DM',
            specialty: 'Cardiology',
            qualification: 'MBBS, MD, DM (Cardiology)',
            experienceYears: 16,
            languages: ['English', 'Tamil'],
            isAvailable: false,
            rating: 4.95,
            currentQueueCount: 3,
            hospitalAffiliation: 'District Care Central Hospital',
            consultationFee: 0,
            avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
        }
    ],
    assessments: [
        {
            id: 'assess-01',
            patientId: 'patient-priya-01',
            patientName: 'Priya Sundaram',
            symptoms: ['Breathing difficulty', 'Chest tightness', 'High Fever'],
            freeTextDescription: 'Struggling to get deep breath since morning. Feeling dizzy.',
            severity: 'Severe',
            vitals: {
                temperatureF: 101.4,
                heartRateBpm: 112,
                spo2Percentage: 89,
                bloodPressure: '135/88'
            },
            riskLevel: 'RED',
            riskSummary: 'High respiratory distress indicated by SpO2 of 89% and elevated heart rate.',
            recommendedAction: 'Immediate emergency evaluation and doctor dispatch required.',
            createdAt: new Date().toISOString()
        }
    ],
    emergencyCases: [
        {
            id: 'emg-101',
            caseNumber: 'CB-EMG-8921',
            patientId: 'patient-priya-01',
            patientName: 'Priya Sundaram',
            patientAge: 42,
            location: 'Kollumangudi Health Centre, Thanjavur District',
            symptoms: ['Breathing difficulty', 'SpO2 89%'],
            vitals: {
                temperatureF: 101.4,
                heartRateBpm: 112,
                spo2Percentage: 89,
                bloodPressure: '135/88'
            },
            riskLevel: 'RED',
            status: 'SOS Raised',
            etaMinutes: 18,
            assignedDoctorName: 'Dr. Arun Kumar, MD',
            assignedHospitalName: 'District Care Central Hospital',
            assignedTransportCode: 'AMB-TR-104',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    hospitals: [
        {
            id: 'hosp-01',
            name: 'District Care Central Hospital',
            location: 'Main Highway Sector, District HQ (14 km)',
            distanceKm: 14.2,
            hasEmergencyUnit: true,
            availableBeds: 18,
            icuAvailable: true,
            specialties: ['Emergency Trauma', 'Pulmonology', 'Cardiology', 'General Surgery'],
            contactPhone: '+91 4366 220100'
        },
        {
            id: 'hosp-02',
            name: 'Sub-District Rural Health Mission Hospital',
            location: 'Taluk Road, Block B (6.5 km)',
            distanceKm: 6.5,
            hasEmergencyUnit: true,
            availableBeds: 8,
            icuAvailable: false,
            specialties: ['General Medicine', 'Pediatrics', 'Maternity'],
            contactPhone: '+91 4366 224411'
        }
    ],
    transports: [
        {
            id: 'trans-01',
            vehicleCode: 'AMB-TR-104',
            type: 'Advanced Emergency Life Support Ambulance',
            driverName: 'Senthil Nathan',
            driverPhone: '+91 94432 10987',
            status: 'Assigned',
            currentLocation: 'En route via State Highway 22',
            etaMinutes: 18
        }
    ],
    consultations: [
        {
            id: 'consult-01',
            patientId: 'patient-priya-01',
            patientName: 'Priya Sundaram',
            doctorId: 'doctor-arun-01',
            doctorName: 'Dr. Arun Kumar, MD',
            doctorSpecialty: 'General Medicine & Critical Care',
            mode: 'video',
            status: 'waiting',
            networkMode: 'Good',
            createdAt: new Date().toISOString()
        }
    ],
    prescriptions: [
        {
            id: 'rx-01',
            consultationId: 'consult-01',
            patientId: 'patient-priya-01',
            patientName: 'Priya Sundaram',
            patientAge: 42,
            doctorId: 'doctor-arun-01',
            doctorName: 'Dr. Arun Kumar, MD',
            doctorSpecialty: 'General Medicine & Critical Care',
            doctorQualification: 'MBBS, MD (General Medicine)',
            hospitalName: 'CareBridge Rural Telemedicine Clinic & District Hospital',
            diagnosis: 'Acute Exacerbation of Asthma / Hypoxia Secondary to Bronchospasm',
            items: [
                {
                    id: 'item-1',
                    medicineName: 'Salbutamol + Ipratropium Nebulizer Respules',
                    dosage: '2.5ml',
                    frequency: 'Immediate + 8 Hourly',
                    duration: '3 Days',
                    instructions: 'Administer via oxygen nebulizer if SpO2 remains <92%'
                },
                {
                    id: 'item-2',
                    medicineName: 'Prednisolone Tablets',
                    dosage: '40mg',
                    frequency: 'Once Daily (Morning after food)',
                    duration: '5 Days',
                    instructions: 'Do not discontinue abruptly'
                },
                {
                    id: 'item-3',
                    medicineName: 'Azithromycin Tablets',
                    dosage: '500mg',
                    frequency: 'Once Daily (After food)',
                    duration: '3 Days',
                    instructions: 'Complete full 3-day course'
                }
            ],
            adviceNotes: 'Monitor SpO2 every 2 hours. Keep emergency contact and hospital handoff on standby.',
            validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        }
    ],
    medicineOrders: [
        {
            id: 'order-01',
            prescriptionId: 'rx-01',
            patientId: 'patient-priya-01',
            patientName: 'Priya Sundaram',
            pharmacyName: 'Kollumangudi Express Rural Pharmacy Unit',
            deliveryAddress: 'House No. 42, Main Road, Kollumangudi Village',
            items: [
                {
                    id: 'item-1',
                    medicineName: 'Salbutamol + Ipratropium Nebulizer Respules',
                    dosage: '2.5ml',
                    frequency: '8 Hourly',
                    duration: '3 Days'
                },
                {
                    id: 'item-2',
                    medicineName: 'Prednisolone Tablets 40mg',
                    dosage: '40mg',
                    frequency: 'Once Daily',
                    duration: '5 Days'
                }
            ],
            totalAmount: 180.00,
            status: 'Confirmed',
            estimatedDelivery: 'Today by 4:30 PM (Health Worker Express Delivery)',
            createdAt: new Date().toISOString()
        }
    ],
    followups: [
        {
            id: 'fol-01',
            patientId: 'patient-priya-01',
            doctorId: 'doctor-arun-01',
            doctorName: 'Dr. Arun Kumar, MD',
            scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            scheduledTime: '10:30 AM',
            reason: 'Post-Emergency Respiratory Check & Oxygen Saturation Review',
            status: 'scheduled'
        }
    ],
    notifications: [
        {
            id: 'notif-01',
            recipientRole: 'patient',
            userId: 'patient-priya-01',
            title: 'Emergency Response Activated',
            message: 'Ambulance TR-104 has been dispatched. Dr. Arun Kumar has reviewed your vitals.',
            type: 'emergency',
            read: false,
            createdAt: new Date().toISOString()
        },
        {
            id: 'notif-02',
            recipientRole: 'doctor',
            userId: 'doctor-arun-01',
            title: 'HIGH PRIORITY RED CASE',
            message: 'Priya Sundaram (SpO2: 89%, HR: 112) has raised emergency SOS.',
            type: 'emergency',
            read: false,
            createdAt: new Date().toISOString()
        }
    ]
};

export function getLocalDB() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
        return INITIAL_DEMO_DATA;
    }
    try {
        return JSON.parse(raw);
    } catch {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
        return INITIAL_DEMO_DATA;
    }
}

export function saveLocalDB(data: typeof INITIAL_DEMO_DATA) {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('carebridge_db_updated'));
}

export function resetDemoDatabase() {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
    window.dispatchEvent(new Event('carebridge_db_updated'));
}
