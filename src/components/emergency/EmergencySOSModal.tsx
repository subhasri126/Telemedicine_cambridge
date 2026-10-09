import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';
import { apiRequest } from '../../lib/apiClient';
import { ShieldAlert, MapPin, CheckCircle, X, AlertTriangle, Send, Truck } from 'lucide-react';

interface EmergencySOSModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
    const { patientData } = useAuth();
    const { t } = useI18n();
    const navigate = useNavigate();

    const [location, setLocation] = useState(patientData?.location || 'Kollumangudi Village, Nagapattinam District');
    const [symptomText, setSymptomText] = useState('Acute Chest Tightness / High Fever');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
    const [smsStatuses, setSmsStatuses] = useState<Array<{ recipientRole: string; status: string; reason?: string }>>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleTriggerSOS = async () => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const res = await apiRequest('/emergency/sos', {
                method: 'POST',
                body: JSON.stringify({
                    patientId: patientData?.id || 'pat-demo-01',
                    patientName: patientData?.fullName || 'Priya Sundaram',
                    patientAge: patientData?.age || 42,
                    location,
                    symptoms: [symptomText, 'SpO2 89%'],
                    vitals: {
                        temperatureF: 101.4,
                        heartRateBpm: 112,
                        spo2Percentage: 89,
                        bloodPressure: '135/88'
                    }
                })
            });

            setCreatedCaseId(res.caseNumber);
            setSmsStatuses(res.sms || []);
        } catch (err: any) {
            console.error('SOS dispatch error:', err);
            setErrorMessage(err instanceof Error ? err.message : 'Emergency SOS could not be submitted.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinish = () => {
        onClose();
        setCreatedCaseId(null);
        navigate('/patient/dashboard');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-rose-200">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 animate-pulse">
                            <ShieldAlert className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg tracking-tight">{t('emergencySosRequest')}</h3>
                            <p className="text-xs text-rose-100">{t('emergencyPipeline')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">

                    {createdCaseId ? (
                        <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-xl text-slate-900">{t('sosActiveCase')} #{createdCaseId}</h4>
                                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto font-medium">
                                    {t('emergencyAlerted')}
                                </p>
                                <div className="mt-3 space-y-1 text-left">
                                    {smsStatuses.length === 0 ? (
                                        <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                            {t('noVerifiedRecipients')}
                                        </p>
                                    ) : smsStatuses.map((sms) => (
                                        <p key={sms.recipientRole} className={`text-[11px] font-semibold rounded-lg px-3 py-2 border ${
                                            sms.status === 'submitted' || sms.status === 'delivered'
                                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                                : 'text-rose-700 bg-rose-50 border-rose-200'
                                        }`}>
                                            {t('smsTo')} {sms.recipientRole.replace('_', ' ')}: {sms.status}
                                            {sms.reason ? ` — ${sms.reason}` : ''}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Live Tracking Progress Bar */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-rose-600" /> AMB-TR-104 (ALS Unit)</span>
                                    <span className="text-rose-600">ETA: 14 Mins</span>
                                </div>

                                <div className="space-y-1.5 text-[11px]">
                                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                                        <span>1. SOS Raised & Registered</span>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                                        <span>2. Doctor Alerted (Dr. Arun Kumar)</span>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex items-center justify-between text-amber-700 font-bold animate-pulse">
                                        <span>3. Hospital Handoff & Transport Dispatched</span>
                                        <span>In Progress</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleFinish}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                            >
                                {t('trackEmergency')}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-rose-900 leading-relaxed">
                                    <p className="font-bold">Are you experiencing a critical medical emergency?</p>
                                    <p className="mt-1">
                                        Triggering SOS dispatches your live location, SpO2 vitals, and alerts the emergency medical queue & registered contacts immediately.
                                    </p>
                                </div>
                            </div>

                            {/* Location Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                                    <span>Pickup Location:</span>
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            {/* Symptom Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Primary Symptoms:</label>
                                <input
                                    type="text"
                                    value={symptomText}
                                    onChange={(e) => setSymptomText(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">Emergency Relative Contact:</span>
                                <span className="font-bold text-slate-800">{patientData?.emergencyContact?.name || 'Murugan Sundaram'} (+91 94432 10988)</span>
                            </div>

                            {/* Action buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleTriggerSOS}
                                    disabled={isSubmitting}
                                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 animate-pulse"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH SOS EMERGENCY'}</span>
                                </button>
                            </div>
                        </>
                    )}

                    {errorMessage && (
                        <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                            {errorMessage}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};
