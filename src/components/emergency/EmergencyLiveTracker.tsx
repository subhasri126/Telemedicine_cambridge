import React from 'react';
import { EmergencyCase, EmergencyStatus } from '../../types';
import { useI18n } from '../../i18n';
import { ShieldAlert, Stethoscope, Building2, Truck, CheckCircle2, Clock, MapPin, User } from 'lucide-react';

interface EmergencyLiveTrackerProps {
    emergencyCase: EmergencyCase;
    onAdvanceStatus?: (nextStatus: EmergencyStatus) => void;
    isDoctorView?: boolean;
}

export const EmergencyLiveTracker: React.FC<EmergencyLiveTrackerProps> = ({
    emergencyCase,
    onAdvanceStatus,
    isDoctorView = false
}) => {
    const { t } = useI18n();
    const steps: { status: EmergencyStatus; label: string; icon: any }[] = [
        { status: 'SOS Raised', label: t('sosRaised'), icon: ShieldAlert },
        { status: 'Doctor Alerted', label: t('doctorConnected'), icon: Stethoscope },
        { status: 'Hospital Alerted', label: t('hospitalNotified'), icon: Building2 },
        { status: 'Transport Assigned', label: t('ambulanceDispatched'), icon: Truck },
        { status: 'Hospital Accepted', label: t('bedReserved'), icon: CheckCircle2 },
        { status: 'Patient Arrived', label: t('patientArrived'), icon: MapPin },
    ];

    const currentIdx = steps.findIndex((s) => s.status === emergencyCase.status);

    return (
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-6 border-2 border-rose-200 shadow-medical space-y-6">

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-extrabold shadow-emergency animate-pulse">
                        SOS
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-slate-900">
                                {t('activeEmergencyCase')} #{emergencyCase.caseNumber}
                            </h3>
                            <span className="text-[10px] bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {emergencyCase.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                            {t('patient')}: <span className="font-bold text-slate-800">{emergencyCase.patientName}</span> ({emergencyCase.patientAge} {t('years')}) — {t('location')}: <span className="font-semibold">{emergencyCase.location}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-2xl border border-rose-200 flex items-center gap-3 shadow-sm">
                    <Clock className="w-5 h-5 text-rose-600 animate-spin" />
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('ambulanceEta')}</span>
                        <span className="text-sm font-extrabold text-rose-600">{emergencyCase.etaMinutes} {t('minutes')}</span>
                    </div>
                </div>
            </div>

            {/* Vitals Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-rose-100 shadow-sm text-xs">
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <span className="text-slate-500 font-semibold block text-[10px]">SpO2 Saturation</span>
                    <span className="font-extrabold text-rose-700 text-sm">{emergencyCase.vitals?.spo2Percentage || 89}% (Critical)</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-slate-500 font-semibold block text-[10px]">Heart Rate</span>
                    <span className="font-extrabold text-amber-700 text-sm">{emergencyCase.vitals?.heartRateBpm || 112} bpm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[10px]">Temperature</span>
                    <span className="font-bold text-slate-800 text-sm">{emergencyCase.vitals?.temperatureF || 101.4}°F</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold block text-[10px]">Blood Pressure</span>
                    <span className="font-bold text-slate-800 text-sm">{emergencyCase.vitals?.bloodPressure || '135/88'}</span>
                </div>
            </div>

            {/* Horizontal Live Progress Timeline */}
            <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const StepIcon = step.icon;

                        return (
                            <div
                                key={step.status}
                                className={`p-3 rounded-2xl border text-center transition-all ${isCurrent
                                        ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300 animate-pulse'
                                        : isCompleted
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                            : 'bg-white text-slate-400 border-slate-200 opacity-60'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center mb-2 ${isCurrent
                                        ? 'bg-white/20 text-white'
                                        : isCompleted
                                            ? 'bg-emerald-200 text-emerald-800'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <StepIcon className="w-4 h-4" />
                                </div>
                                <p className="text-[11px] font-bold leading-tight">{step.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Doctor Action Controls if in Doctor View */}
            {isDoctorView && onAdvanceStatus && currentIdx < steps.length - 1 && (
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{t('advanceEmergencyWorkflow')}:</span>
                    <button
                        onClick={() => onAdvanceStatus(steps[currentIdx + 1].status)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                    >
                        Mark "{steps[currentIdx + 1].label}" →
                    </button>
                </div>
            )}

        </div>
    );
};
