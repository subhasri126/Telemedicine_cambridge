import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';
import { apiRequest } from '../../lib/apiClient';
import { EmergencyCase } from '../../types';
import {
    Stethoscope,
    ShieldAlert,
    User,
    CheckCircle2,
    AlertCircle,
    Building2,
    ChevronRight,
    Clock,
    ShieldCheck,
    Sparkles
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
    const { doctorData, verificationStatus, verifyDoctorDemoAdmin } = useAuth();
    const { t } = useI18n();
    const navigate = useNavigate();

    const [queue, setQueue] = useState<any[]>([]);
    const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyCase[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    const loadDoctorDashboardData = async () => {
        try {
            // Fetch live patient queue from backend API
            const queueData = await apiRequest('/doctors/queue');
            if (Array.isArray(queueData)) {
                setQueue(queueData);
            }

            // Fetch live emergency cases from backend API
            const emgData = await apiRequest('/emergency/cases');
            if (Array.isArray(emgData)) {
                setEmergencyAlerts(emgData.filter((e: any) => e.status !== 'Patient Arrived' && e.status !== 'Resolved'));
            }
        } catch (error) {
            console.warn('Backend query error, setting fallback queue:', error);
        }
    };

    useEffect(() => {
        loadDoctorDashboardData();
        const interval = setInterval(loadDoctorDashboardData, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleOnline = async () => {
        const nextState = !isOnline;
        setIsOnline(nextState);
        try {
            await apiRequest('/doctors/status', {
                method: 'PATCH',
                body: JSON.stringify({ isOnline: nextState })
            });
        } catch (e) {
            console.error('Failed to toggle status:', e);
        }
    };

    const handleDemoAdminVerify = async () => {
        setIsVerifying(true);
        try {
            await verifyDoctorDemoAdmin();
            await loadDoctorDashboardData();
        } finally {
            setIsVerifying(false);
        }
    };

    const isPendingVerification = verificationStatus === 'PENDING';

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* DOCTOR VERIFICATION PENDING BANNER */}
                {isPendingVerification && (
                    <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 text-amber-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                                <Clock className="w-6 h-6 animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-base text-amber-900 flex items-center gap-2">
                                    <span>{t('credentialsUnderVerification')}</span>
                                    <span className="text-xs font-semibold bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">{t('pendingApproval')}</span>
                                </h3>
                                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                    {t('credentialsReview')}
                                </p>
                            </div>
                        </div>

                        {/* Hackathon Demo Instant Verification Trigger */}
                        <button
                            onClick={handleDemoAdminVerify}
                            disabled={isVerifying}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{isVerifying ? t('verifying') : t('verifyDemo')}</span>
                        </button>
                    </div>
                )}

                {/* Doctor Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-medical relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 backdrop-blur-md border border-teal-400/30 flex items-center justify-center font-bold text-teal-300 text-xl">
                                Dr
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-extrabold">{doctorData?.fullName || 'Dr. Arun Kumar'}</h1>
                                    <span className="text-xs bg-teal-400/20 text-teal-300 font-bold px-2.5 py-0.5 rounded-full border border-teal-300/30">
                                        {doctorData?.specialty || 'General Medicine'}
                                    </span>
                                    {verificationStatus === 'VERIFIED' && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>VERIFIED DOCTOR</span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    {doctorData?.hospitalAffiliation || 'Mayiladuthurai District Headquarters Hospital'}
                                </p>
                            </div>
                        </div>

                        {/* Availability Toggle Switch */}
                        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                            <div className="text-right">
                                <span className="text-xs font-extrabold block text-white">{t('dutyStatus')}</span>
                                <span className={`text-[10px] font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    {isOnline ? t('onlineAccepting') : t('offline')}
                                </span>
                            </div>
                            <button
                                onClick={handleToggleOnline}
                                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${isOnline ? 'bg-emerald-500' : 'bg-slate-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Emergency Alert Banner */}
                {emergencyAlerts.length > 0 && (
                    <div className="bg-rose-600 text-white rounded-3xl p-5 shadow-emergency space-y-3 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6" />
                                <h3 className="font-extrabold text-base">{t('criticalEmergencyAlert')}</h3>
                            </div>
                            <span className="text-xs font-extrabold bg-white text-rose-700 px-3 py-1 rounded-full">
                                {emergencyAlerts.length} {t('activeCases')}
                            </span>
                        </div>

                        {emergencyAlerts.map((emg) => (
                            <div key={emg.id} className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-white/20">
                                <div>
                                    <p className="font-bold">Case #{emg.caseNumber}: {emg.patientName} ({emg.patientAge || 42} Yrs)</p>
                                    <p className="text-rose-100 mt-0.5">Location: {emg.location} • Status: {emg.status}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/doctor/patient/${emg.patientId || 'pat-demo-01'}`)}
                                    className="px-4 py-2 bg-white text-rose-700 font-extrabold rounded-xl shadow-sm hover:bg-slate-100 transition-colors"
                                >
                                    {t('reviewPatient')} →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">{t('priorityQueue')}</span>
                            <span className="text-2xl font-extrabold text-slate-900">{queue.length} {t('patients')}</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">{t('highRisk')}</span>
                            <span className="text-2xl font-extrabold text-rose-600">
                                {queue.filter((q) => q.riskLevel === 'RED').length} {t('criticalCases')}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">{t('doctorStatus')}</span>
                            <span className="text-2xl font-extrabold text-emerald-600">
                                {verificationStatus || 'VERIFIED'}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Priority Triage Queue Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-medical space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="font-extrabold text-base text-slate-900">{t('priorityQueue')}</h3>
                            <p className="text-xs text-slate-500">{t('sortedQueue')}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {queue.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                {t('noPatientsQueue')}
                            </div>
                        ) : (
                            queue.map((patient) => (
                                <div
                                    key={patient.id || patient.assessmentId}
                                    onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md ${patient.riskLevel === 'RED'
                                        ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                                        : patient.riskLevel === 'ORANGE'
                                            ? 'bg-orange-50/70 border-orange-200 hover:border-orange-300'
                                            : patient.riskLevel === 'YELLOW'
                                                ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white text-[11px] shadow-sm ${patient.riskLevel === 'RED' ? 'bg-rose-600 animate-pulse' : patient.riskLevel === 'ORANGE' ? 'bg-orange-600' : patient.riskLevel === 'YELLOW' ? 'bg-amber-600' : 'bg-emerald-600'
                                            }`}>
                                            <span>{patient.riskLevel}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm text-slate-900">{patient.fullName}</h4>
                                                <span className="text-xs text-slate-500">({patient.age || 42} Yrs)</span>
                                                {patient.waitingMinutes && (
                                                    <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                                                        Waiting: {patient.waitingMinutes} min
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-700 mt-0.5 font-medium">
                                                Symptoms: {Array.isArray(patient.symptoms) ? patient.symptoms.join(', ') : patient.symptoms}
                                            </p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Location: {patient.location || 'Rural Village'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4">
                                        <div className="text-right text-xs">
                                            <span className="font-extrabold text-slate-800 block">SpO2: {patient.vitals?.spo2Percentage || 98}%</span>
                                            <span className="text-[10px] text-slate-500">Pulse: {patient.vitals?.heartRateBpm || 76} bpm</span>
                                        </div>

                                        <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-brand-50 hover:text-brand-600 flex items-center gap-1 shadow-sm">
                                            <span>Start Consult</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
