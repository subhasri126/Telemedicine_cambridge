export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
}

export interface PatientProfile {
    id: string;
    profileId: string;
    fullName: string;
    email: string;
    age: number;
    gender: string;
    bloodGroup: string;
    location: string;
    medicalHistory: string[];
    currentMedications: string[];
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
}

export interface DoctorProfile {
    id: string;
    profileId: string;
    fullName: string;
    specialty: string;
    qualification: string;
    experienceYears: number;
    languages: string[];
    isAvailable: boolean;
    isOnline?: boolean;
    rating: number;
    currentQueueCount: number;
    hospitalAffiliation: string;
    consultationFee: number;
    avatarUrl?: string;
}

export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface HealthVitals {
    temperatureF?: number;
    heartRateBpm?: number;
    spo2Percentage?: number;
    bloodPressure?: string;
}

export interface SymptomAssessment {
    id: string;
    patientId: string;
    patientName: string;
    symptoms: string[];
    freeTextDescription?: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    vitals: HealthVitals;
    riskLevel: RiskLevel;
    riskSummary: string;
    recommendedAction: string;
    createdAt: string;
}

export type EmergencyStatus =
    | 'SOS Raised'
    | 'Doctor Alerted'
    | 'Hospital Alerted'
    | 'Transport Assigned'
    | 'Hospital Accepted'
    | 'Patient Arrived'
    | 'Resolved';

export interface EmergencyCase {
    id: string;
    caseNumber: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    location: string;
    symptoms: string[];
    vitals: HealthVitals;
    riskLevel: RiskLevel;
    status: EmergencyStatus;
    etaMinutes: number;
    assignedDoctorName?: string;
    assignedHospitalName?: string;
    assignedTransportCode?: string;
    doctorNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Hospital {
    id: string;
    name: string;
    location: string;
    distanceKm: number;
    hasEmergencyUnit: boolean;
    availableBeds: number;
    icuAvailable: boolean;
    specialties: string[];
    contactPhone: string;
}

export interface TransportUnit {
    id: string;
    vehicleCode: string;
    type: string;
    driverName: string;
    driverPhone: string;
    status: 'Available' | 'Assigned' | 'En Route' | 'Arrived';
    currentLocation: string;
    etaMinutes: number;
}

export type BandwidthMode = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Offline';

export interface Consultation {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    mode: 'video' | 'audio' | 'chat';
    status: 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';
    networkMode: BandwidthMode;
    clinicalNotes?: string;
    diagnosis?: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
}

export interface PrescriptionItem {
    id: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface Prescription {
    id: string;
    consultationId?: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorQualification: string;
    hospitalName: string;
    diagnosis: string;
    items: PrescriptionItem[];
    adviceNotes?: string;
    validUntil: string;
    createdAt: string;
}

export type OrderStatus = 'Requested' | 'Confirmed' | 'Out for Delivery' | 'Delivered';

export interface MedicineOrder {
    id: string;
    prescriptionId: string;
    patientId: string;
    patientName: string;
    pharmacyName: string;
    deliveryAddress: string;
    items: PrescriptionItem[];
    totalAmount: number;
    status: OrderStatus;
    estimatedDelivery: string;
    createdAt: string;
}

export interface Followup {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    scheduledDate: string;
    scheduledTime: string;
    reason: string;
    status: 'scheduled' | 'completed';
}

export interface CareJourneyState {
    healthAssessment: 'completed' | 'active' | 'pending';
    doctorConsultation: 'completed' | 'active' | 'pending';
    treatmentDecision: 'completed' | 'active' | 'pending';
    prescription: 'completed' | 'active' | 'pending';
    medicineDelivery: 'completed' | 'active' | 'pending';
    followup: 'completed' | 'active' | 'pending';
}

export interface AppNotification {
    id: string;
    recipientRole: 'patient' | 'doctor' | 'hospital' | 'all';
    userId?: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'emergency' | 'success';
    read: boolean;
    createdAt: string;
}
