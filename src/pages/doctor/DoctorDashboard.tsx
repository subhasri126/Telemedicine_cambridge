import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoctorQueue, updateDoctorStatus } from '../../services/doctorService';
import { getAllEmergencyCases } from '../../services/emergencyService';
import { EmergencyCase } from '../../types';
import {
    Stethoscope,
    ShieldAlert,
    User,
    Activity,
    Clock,
    CheckCircle2,
    Video,
    FileText,
    AlertCircle,
    Search,
    Building2,
    ChevronRight
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
    const { doctorData } = useAuth();
    const navigate = useNavigate();

    const [queue, setQueue] = useState<any[]>([]);
    const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyCase[]>([]);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const loadDoctorData = () => {
            const q = getDoctorQueue();
            setQueue(q);

            const emgs = getAllEmergencyCases();
            setEmergencyAlerts(emgs.filter((e) => e.status !== 'Patient Arrived'));
        };

        loadDoctorData();
        window.addEventListener('carebridge_db_updated', loadDoctorData);
        return () => window.removeEventListener('carebridge_db_updated', loadDoctorData);
    }, []);

    const handleToggleOnline = () => {
        if (doctorData) {
            updateDoctorStatus(doctorData.id, !isOnline);
            setIsOnline(!isOnline);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

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
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    {doctorData?.hospitalAffiliation || 'District Care Hospital & Rural Health Network'}
                                </p>
                            </div>
                        </div>

                        {/* Availability Toggle Switch */}
                        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                            <div className="text-right">
                                <span className="text-xs font-extrabold block text-white">Duty Tele-Status</span>
                                <span className={`text-[10px] font-bold ${doctorData?.isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    {doctorData?.isOnline ? 'ONLINE & ACCEPTING PATIENTS' : 'OFFLINE'}
                                </span>
                            </div>
                            <button
                                onClick={handleToggleOnline}
                                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${doctorData?.isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${doctorData?.isOnline ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Emergency Alert Banner (If Active SOS Cases) */}
                {emergencyAlerts.length > 0 && (
                    <div className="bg-rose-600 text-white rounded-3xl p-5 shadow-emergency space-y-3 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6" />
                                <h3 className="font-extrabold text-base">CRITICAL EMERGENCY SOS ALERT</h3>
                            </div>
                            <span className="text-xs font-extrabold bg-white text-rose-700 px-3 py-1 rounded-full">
                                {emergencyAlerts.length} Active Cases
                            </span>
                        </div>

                        {emergencyAlerts.map((emg) => (
                            <div key={emg.id} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-white/20">
                                <div>
                                    <p className="font-bold">Case #{emg.caseNumber}: {emg.patientName} ({emg.patientAge} Yrs)</p>
                                    <p className="text-rose-100 mt-0.5">Location: {emg.location} • SpO2: {emg.vitals?.spo2Percentage}%</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/doctor/patient/${emg.patientId}`)}
                                    className="px-4 py-2 bg-white text-rose-700 font-extrabold rounded-xl shadow-sm hover:bg-slate-100 transition-colors"
                                >
                                    Review Patient & Dispatch →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">Patient Queue</span>
                            <span className="text-2xl font-extrabold text-slate-900">{queue.length} Pending</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">High Risk (RED)</span>
                            <span className="text-2xl font-extrabold text-rose-600">
                                {queue.filter((q) => q.riskLevel === 'RED').length} Critical
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500 font-bold block">Consultations Completed</span>
                            <span className="text-2xl font-extrabold text-emerald-600">12 Today</span>
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
                            <h3 className="font-extrabold text-base text-slate-900">Priority Patient Triage Queue</h3>
                            <p className="text-xs text-slate-500">Sorted automatically by clinical urgency & SpO2 thresholds</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {queue.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md ${patient.riskLevel === 'RED'
                                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                                    : patient.riskLevel === 'YELLOW'
                                        ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-white text-xs ${patient.riskLevel === 'RED' ? 'bg-rose-600 animate-pulse' : patient.riskLevel === 'YELLOW' ? 'bg-amber-600' : 'bg-emerald-600'
                                        }`}>
                                        {patient.riskLevel}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-slate-900">{patient.fullName}</h4>
                                            <span className="text-xs text-slate-500">({patient.age} Yrs)</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                                            Symptoms: {patient.symptoms.join(', ')}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Location: {patient.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <div className="text-right text-xs">
                                        <span className="font-extrabold text-slate-800 block">SpO2: {patient.vitals.spo2Percentage}%</span>
                                        <span className="text-[10px] text-slate-500">Pulse: {patient.vitals.heartRateBpm} bpm</span>
                                    </div>

                                    <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-brand-50 hover:text-brand-600 flex items-center gap-1">
                                        <span>View Record</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};
