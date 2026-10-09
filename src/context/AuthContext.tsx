import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PatientProfile, DoctorProfile } from '../types';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../lib/apiClient';

interface AuthContextType {
    user: UserProfile | null;
    patientData: PatientProfile | null;
    doctorData: DoctorProfile | null;
    role: 'patient' | 'doctor' | null;
    isLoading: boolean;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
    login: (email: string, password: string, selectedRole: 'patient' | 'doctor') => Promise<boolean>;
    loginAsDemoPatient: () => Promise<boolean>;
    loginAsDemoDoctor: () => Promise<boolean>;
    logout: () => void;
    registerPatient: (formData: any) => Promise<boolean>;
    registerDoctor: (formData: FormData) => Promise<boolean>;
    verifyDoctorDemoAdmin: (doctorId?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [patientData, setPatientData] = useState<PatientProfile | null>(null);
    const [doctorData, setDoctorData] = useState<DoctorProfile | null>(null);
    const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadCurrentUser = async () => {
        const token = getAuthToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const data = await apiRequest('/auth/me');
            if (data.role === 'patient') {
                setUser({
                    id: data.id,
                    email: data.email,
                    fullName: data.fullName,
                    role: 'patient',
                    phone: data.phone
                });
                setPatientData({
                    id: data.profileId,
                    profileId: data.profileId,
                    fullName: data.fullName,
                    email: data.email,
                    age: data.age || 42,
                    gender: data.gender || 'Female',
                    bloodGroup: 'O+',
                    location: `${data.village || 'Kollumangudi'}, ${data.district || 'Nagapattinam'}`,
                    medicalHistory: ['Hypertension screening'],
                    currentMedications: [],
                    emergencyContact: {
                        name: data.emergencyContactName || 'Emergency Contact',
                        phone: data.emergencyContactPhone || '+91 94432 10988',
                        relation: 'Family'
                    }
                });
                setRole('patient');
                setVerificationStatus(null);
            } else if (data.role === 'doctor') {
                setUser({
                    id: data.id,
                    email: data.email,
                    fullName: data.fullName,
                    role: 'doctor'
                });
                setDoctorData({
                    id: data.profileId,
                    profileId: data.profileId,
                    fullName: data.fullName,
                    specialty: data.specialty || 'General Medicine',
                    qualification: data.qualification || 'MBBS, MD',
                    experienceYears: data.experienceYears || 10,
                    languages: ['English', 'Tamil'],
                    isAvailable: Boolean(data.isOnline),
                    rating: 4.9,
                    currentQueueCount: 2,
                    hospitalAffiliation: data.hospitalClinic || 'District Health Headquarters',
                    consultationFee: 0,
                    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
                });
                setRole('doctor');
                setVerificationStatus(data.verificationStatus || 'PENDING');
            }
        } catch (error) {
            console.warn('Auto auth failed, clearing token:', error);
            removeAuthToken();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const login = async (email: string, password: string, selectedRole: 'patient' | 'doctor'): Promise<boolean> => {
        setIsLoading(true);
        try {
            const endpoint = selectedRole === 'patient' ? '/auth/patient/login' : '/auth/doctor/login';
            const res = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (res.token) {
                setAuthToken(res.token);
                await loadCurrentUser();
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsDemoPatient = async (): Promise<boolean> => {
        return login('priya@carebridge.org', 'Password123!', 'patient');
    };

    const loginAsDemoDoctor = async (): Promise<boolean> => {
        return login('arun@carebridge.org', 'Password123!', 'doctor');
    };

    const logout = () => {
        setUser(null);
        setPatientData(null);
        setDoctorData(null);
        setRole(null);
        setVerificationStatus(null);
        removeAuthToken();
    };

    const registerPatient = async (formData: any): Promise<boolean> => {
        setIsLoading(true);
        try {
            const res = await apiRequest('/auth/patient/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (res.token) {
                setAuthToken(res.token);
                await loadCurrentUser();
                return true;
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const registerDoctor = async (formData: FormData): Promise<boolean> => {
        setIsLoading(true);
        try {
            const res = await apiRequest('/auth/doctor/register', {
                method: 'POST',
                body: formData
            });

            if (res.token) {
                setAuthToken(res.token);
                await loadCurrentUser();
                return true;
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyDoctorDemoAdmin = async (doctorId?: string): Promise<boolean> => {
        const targetId = doctorId || doctorData?.id || user?.id;
        if (!targetId) return false;

        try {
            const res = await apiRequest(`/doctors/verify/${targetId}`, {
                method: 'POST',
                body: JSON.stringify({ status: 'VERIFIED' })
            });

            if (res.verificationStatus) {
                setVerificationStatus('VERIFIED');
                if (doctorData) {
                    setDoctorData({ ...doctorData });
                }
                return true;
            }
            return false;
        } catch (e) {
            console.error('Demo admin verification failed:', e);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                patientData,
                doctorData,
                role,
                isLoading,
                verificationStatus,
                login,
                loginAsDemoPatient,
                loginAsDemoDoctor,
                logout,
                registerPatient,
                registerDoctor,
                verifyDoctorDemoAdmin
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
