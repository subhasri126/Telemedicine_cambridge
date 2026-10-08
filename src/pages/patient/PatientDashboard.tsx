import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CareJourneyTracker } from '../../components/care-journey/CareJourneyTracker';
import { EmergencyLiveTracker } from '../../components/emergency/EmergencyLiveTracker';
import { getActiveEmergencyCase } from '../../services/emergencyService';
import { getPrescriptions } from '../../services/prescriptionService';
import { getMedicineOrders } from '../../services/medicineService';
import { EmergencyCase, Prescription, MedicineOrder } from '../../types';
import {
    Bot,
    Stethoscope,
    ShieldAlert,
    Activity,
    FileText,
    Truck,
    Video,
    Calendar,
    CheckCircle2,
    Clock,
    MapPin,
    ArrowRight,
    Heart,
    Thermometer
} from 'lucide-react';

interface PatientDashboardProps {
    onOpenAIModal: () => void;
    onOpenSOSModal: () => void;
    language: 'en' | 'ta';
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
    onOpenAIModal,
    onOpenSOSModal,
    language
}) => {
    const { user, patientData } = useAuth();
    const navigate = useNavigate();

    const [activeSOSCase, setActiveSOSCase] = useState<EmergencyCase | null>(null);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [orders, setOrders] = useState<MedicineOrder[]>([]);

    useEffect(() => {
        const loadDashboardData = () => {
            if (patientData) {
                const emg = getActiveEmergencyCase(patientData.id);
                setActiveSOSCase(emg);

                const rxs = getPrescriptions(patientData.id);
                setPrescriptions(rxs);

                const mOrders = getMedicineOrders(patientData.id);
                setOrders(mOrders);
            }
        };

        loadDashboardData();
        window.addEventListener('carebridge_db_updated', loadDashboardData);
        return () => window.removeEventListener('carebridge_db_updated', loadDashboardData);
    }, [patientData]);

    const latestRx = prescriptions[0];
    const latestOrder = orders[0];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Greeting Banner */}
                <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-medical relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <span className="text-xs text-brand-100 font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                                {language === 'ta' ? 'கிராமப்புற நோயாளி போர்ட்டல்' : 'Rural Patient Portal'}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                                {language === 'ta' ? 'வணக்கம்,' : 'Good Morning,'} {patientData?.fullName || user?.fullName || 'Priya'}
                            </h1>
                            <p className="text-xs sm:text-sm text-brand-100 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-brand-200" />
                                <span>{patientData?.location || 'Kollumangudi Health Centre, Thanjavur District'}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={onOpenAIModal}
                                className="px-4 py-2.5 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <Bot className="w-4 h-4 text-brand-600" />
                                <span>Ask CareBridge Assistant</span>
                            </button>

                            <button
                                onClick={onOpenSOSModal}
                                className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-emergency transition-all flex items-center gap-1.5 animate-pulse"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Emergency SOS</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live SOS Tracker (If Emergency Case Active) */}
                {activeSOSCase && (
                    <EmergencyLiveTracker emergencyCase={activeSOSCase} />
                )}

                {/* Quick Action Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'AI Assistant', desc: 'Voice & text triage', icon: Bot, action: onOpenAIModal, color: 'bg-sky-50 border-sky-200 text-sky-800' },
                        { label: 'Health Assessment', desc: 'Multi-step check', icon: Activity, path: '/patient/health-check', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                        { label: 'Find Doctor', desc: 'Match specialists', icon: Stethoscope, path: '/patient/doctors', color: 'bg-brand-50 border-brand-200 text-brand-800' },
                        { label: 'Consultation Room', desc: 'WebRTC video call', icon: Video, path: '/consultation/consult-01', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                        { label: 'Prescriptions', desc: 'Download PDF', icon: FileText, path: '/patient/prescriptions', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                        { label: 'Medicine Delivery', desc: 'Doorstep order', icon: Truck, path: '/patient/pharmacy', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => (item.action ? item.action() : item.path && navigate(item.path))}
                                className={`p-4 rounded-3xl border cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all ${item.color}`}
                            >
                                <div className="w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center mb-3 shadow-sm">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-xs leading-snug">{item.label}</h3>
                                <p className="text-[10px] opacity-80 mt-0.5">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Interactive "My Care Journey" Component */}
                <CareJourneyTracker />

                {/* Vitals Summary & Active Consultations Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Vitals & Baseline Health Card */}
                    <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-medical space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-brand-600" />
                                <span>MY RECENT VITALS & TRIAGE</span>
                            </h3>
                            <Link to="/patient/health-check" className="text-xs font-bold text-brand-600 hover:underline">
                                New Health Assessment →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-semibold text-slate-500 block">SpO2 Level</span>
                                <span className="font-extrabold text-rose-600 text-base">89%</span>
                                <span className="text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded block mt-1 w-fit font-bold">Low Oxygen</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-semibold text-slate-500 block">Pulse Rate</span>
                                <span className="font-extrabold text-amber-600 text-base">112 bpm</span>
                                <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded block mt-1 w-fit font-bold">Elevated</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-semibold text-slate-500 block">Temperature</span>
                                <span className="font-bold text-slate-800 text-base">101.4°F</span>
                                <span className="text-[9px] text-slate-600 block mt-1">Fever Detected</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-semibold text-slate-500 block">Blood Pressure</span>
                                <span className="font-bold text-slate-800 text-base">135/88</span>
                                <span className="text-[9px] text-slate-600 block mt-1">Pre-hypertension</span>
                            </div>
                        </div>

                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Latest AI Triage Alert: RED / HIGH PRIORITY</p>
                                <p className="text-[11px] text-rose-800 mt-0.5">
                                    Respiratory tightness with low SpO2. Emergency doctor alert & transport dispatch active.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Consultation & Prescription Quick Access */}
                    <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-medical space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-teal-600" />
                                    <span>UPCOMING CONSULTATION & RX</span>
                                </h3>
                                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                            </div>

                            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200/80 flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Assigned Specialist</span>
                                    <h4 className="font-extrabold text-slate-900 text-sm">Dr. Arun Kumar, MD</h4>
                                    <p className="text-xs text-slate-600">General Medicine & Critical Care • District Hospital</p>
                                </div>
                                <button
                                    onClick={() => navigate('/consultation/consult-01')}
                                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                                >
                                    <Video className="w-4 h-4" />
                                    <span>Join Session</span>
                                </button>
                            </div>

                            {latestRx && (
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-brand-600" />
                                        <div>
                                            <p className="font-bold text-slate-800">Digital Prescription Ready</p>
                                            <p className="text-[10px] text-slate-500">{latestRx.diagnosis}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/patient/prescriptions')}
                                        className="text-xs text-brand-600 font-bold hover:underline"
                                    >
                                        View & Download →
                                    </button>
                                </div>
                            )}
                        </div>

                        {latestOrder && (
                            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-amber-600" />
                                    <div>
                                        <p className="font-bold text-amber-900">Doorstep Delivery: {latestOrder.status}</p>
                                        <p className="text-[10px] text-amber-700">{latestOrder.estimatedDelivery}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/patient/pharmacy')}
                                    className="text-xs text-amber-800 font-bold hover:underline"
                                >
                                    Track Courier →
                                </button>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
};
