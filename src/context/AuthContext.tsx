import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PatientProfile, DoctorProfile } from '../types';
import { getLocalDB, saveLocalDB } from '../lib/supabase';

interface AuthContextType {
    user: UserProfile | null;
    patientData: PatientProfile | null;
    doctorData: DoctorProfile | null;
    role: 'patient' | 'doctor' | null;
    isLoading: boolean;
    login: (email: string, role: 'patient' | 'doctor') => Promise<boolean>;
    loginAsDemoPatient: () => void;
    loginAsDemoDoctor: () => void;
    logout: () => void;
    registerPatient: (details: Partial<PatientProfile> & { fullName: string; email: string }) => Promise<boolean>;
    registerDoctor: (details: Partial<DoctorProfile> & { fullName: string; email: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [patientData, setPatientData] = useState<PatientProfile | null>(null);
    const [doctorData, setDoctorData] = useState<DoctorProfile | null>(null);
    const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check saved session in localStorage
        const savedSession = localStorage.getItem('carebridge_session');
        const db = getLocalDB();

        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (parsed.role === 'patient') {
                    const p = db.patients.find((item: PatientProfile) => item.id === parsed.patientId) || db.patients[0];
                    setUser({
                        id: p.profileId,
                        email: p.email,
                        fullName: p.fullName,
                        role: 'patient',
                        phone: p.emergencyContact?.phone
                    });
                    setPatientData(p);
                    setRole('patient');
                } else if (parsed.role === 'doctor') {
                    const d = db.doctors.find((item: DoctorProfile) => item.id === parsed.doctorId) || db.doctors[0];
                    setUser({
                        id: d.profileId,
                        email: 'doctor.arun@carebridge.org',
                        fullName: d.fullName,
                        role: 'doctor',
                        avatarUrl: d.avatarUrl
                    });
                    setDoctorData(d);
                    setRole('doctor');
                }
            } catch (e) {
                console.error('Session load error', e);
            }
        } else {
            // Default to logged-in Patient (Priya) for seamless instant experience
            const defaultPatient = db.patients[0];
            setUser({
                id: defaultPatient.profileId,
                email: defaultPatient.email,
                fullName: defaultPatient.fullName,
                role: 'patient'
            });
            setPatientData(defaultPatient);
            setRole('patient');
        }

        setIsLoading(false);
    }, []);

    const loginAsDemoPatient = () => {
        const db = getLocalDB();
        const p = db.patients[0];
        const u: UserProfile = {
            id: p.profileId,
            email: p.email,
            fullName: p.fullName,
            role: 'patient',
            phone: p.emergencyContact?.phone
        };
        setUser(u);
        setPatientData(p);
        setDoctorData(null);
        setRole('patient');
        localStorage.setItem('carebridge_session', JSON.stringify({ role: 'patient', patientId: p.id }));
    };

    const loginAsDemoDoctor = () => {
        const db = getLocalDB();
        const d = db.doctors[0];
        const u: UserProfile = {
            id: d.profileId,
            email: 'dr.arun@carebridge.org',
            fullName: d.fullName,
            role: 'doctor',
            avatarUrl: d.avatarUrl
        };
        setUser(u);
        setDoctorData(d);
        setPatientData(null);
        setRole('doctor');
        localStorage.setItem('carebridge_session', JSON.stringify({ role: 'doctor', doctorId: d.id }));
    };

    const login = async (email: string, selectedRole: 'patient' | 'doctor'): Promise<boolean> => {
        setIsLoading(true);
        const db = getLocalDB();
        if (selectedRole === 'patient') {
            const p = db.patients.find((item: PatientProfile) => item.email.toLowerCase() === email.toLowerCase()) || db.patients[0];
            setUser({ id: p.profileId, email: p.email, fullName: p.fullName, role: 'patient' });
            setPatientData(p);
            setRole('patient');
            localStorage.setItem('carebridge_session', JSON.stringify({ role: 'patient', patientId: p.id }));
        } else {
            const d = db.doctors.find((item: DoctorProfile) => item.fullName.toLowerCase().includes(email.toLowerCase())) || db.doctors[0];
            setUser({ id: d.profileId, email: email, fullName: d.fullName, role: 'doctor', avatarUrl: d.avatarUrl });
            setDoctorData(d);
            setRole('doctor');
            localStorage.setItem('carebridge_session', JSON.stringify({ role: 'doctor', doctorId: d.id }));
        }
        setIsLoading(false);
        return true;
    };

    const logout = () => {
        setUser(null);
        setPatientData(null);
        setDoctorData(null);
        setRole(null);
        localStorage.removeItem('carebridge_session');
    };

    const registerPatient = async (details: Partial<PatientProfile> & { fullName: string; email: string }): Promise<boolean> => {
        const db = getLocalDB();
        const newPatient: PatientProfile = {
            id: `patient-${Date.now()}`,
            profileId: `profile-${Date.now()}`,
            fullName: details.fullName,
            email: details.email,
            age: details.age || 35,
            gender: details.gender || 'Other',
            bloodGroup: details.bloodGroup || 'B+',
            location: details.location || 'Rural Village Centre',
            medicalHistory: details.medicalHistory || [],
            currentMedications: details.currentMedications || [],
            emergencyContact: details.emergencyContact || {
                name: 'Family Contact',
                phone: '+91 90000 00000',
                relation: 'Relative'
            }
        };
        db.patients.push(newPatient);
        saveLocalDB(db);

        setUser({ id: newPatient.profileId, email: newPatient.email, fullName: newPatient.fullName, role: 'patient' });
        setPatientData(newPatient);
        setRole('patient');
        localStorage.setItem('carebridge_session', JSON.stringify({ role: 'patient', patientId: newPatient.id }));
        return true;
    };

    const registerDoctor = async (details: Partial<DoctorProfile> & { fullName: string; email: string }): Promise<boolean> => {
        const db = getLocalDB();
        const newDoctor: DoctorProfile = {
            id: `doctor-${Date.now()}`,
            profileId: `profile-${Date.now()}`,
            fullName: details.fullName,
            specialty: details.specialty || 'General Medicine',
            qualification: details.qualification || 'MBBS',
            experienceYears: details.experienceYears || 5,
            languages: details.languages || ['English', 'Tamil'],
            isAvailable: true,
            rating: 4.8,
            currentQueueCount: 0,
            hospitalAffiliation: details.hospitalAffiliation || 'District Care Hospital',
            consultationFee: 0,
            avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
        };
        db.doctors.push(newDoctor);
        saveLocalDB(db);

        setUser({ id: newDoctor.profileId, email: details.email, fullName: newDoctor.fullName, role: 'doctor' });
        setDoctorData(newDoctor);
        setRole('doctor');
        localStorage.setItem('carebridge_session', JSON.stringify({ role: 'doctor', doctorId: newDoctor.id }));
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                patientData,
                doctorData,
                role,
                isLoading,
                login,
                loginAsDemoPatient,
                loginAsDemoDoctor,
                logout,
                registerPatient,
                registerDoctor
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
