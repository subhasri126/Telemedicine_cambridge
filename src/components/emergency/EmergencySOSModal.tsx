import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createEmergencySOS } from '../../services/emergencyService';
import { ShieldAlert, MapPin, PhoneCall, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface EmergencySOSModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
    const { patientData } = useAuth();
    const navigate = useNavigate();

    const [location, setLocation] = useState(patientData?.location || 'Kollumangudi Health Centre, Thanjavur District');
    const [symptomText, setSymptomText] = useState('Acute Respiratory Distress / High Fever');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleTriggerSOS = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const emergencyCase = createEmergencySOS({
                patientId: patientData?.id || 'patient-priya-01',
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
            });
            setIsSubmitting(false);
            setCreatedCaseId(emergencyCase.caseNumber);
        }, 800);
    };

    const handleFinish = () => {
        onClose();
        setCreatedCaseId(null);
        navigate('/patient/dashboard');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-emergency w-full max-w-md overflow-hidden border border-rose-200">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-rose-600 via-emergency-600 to-rose-700 text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 animate-pulse">
                            <ShieldAlert className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg tracking-tight">EMERGENCY SOS REQUEST</h3>
                            <p className="text-xs text-rose-100">CareBridge Rural Critical Care Dispatch</p>
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
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-xl text-slate-900">SOS ACTIVE — CASE #{createdCaseId}</h4>
                                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                                    Nearest hospital (District Care Central) and Dr. Arun Kumar have been alerted. Emergency Ambulance TR-104 is en route.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Assigned Transport:</span>
                                    <span className="font-bold text-slate-800">AMB-TR-104 (Advanced Life Support)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Estimated Arrival (ETA):</span>
                                    <span className="font-extrabold text-rose-600">18 Minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Emergency Contact:</span>
                                    <span className="font-bold text-slate-800">Mother (+91 98765 43210) — NOTIFIED</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFinish}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                            >
                                Track Emergency Status on Dashboard
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-rose-900 leading-relaxed">
                                    <p className="font-bold">Are you experiencing a medical emergency?</p>
                                    <p className="mt-1">
                                        Triggering SOS will instantly alert the nearest duty doctor, dispatch transport, and notify your registered emergency contact.
                                    </p>
                                </div>
                            </div>

                            {/* Location Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                                    <span>Current Pickup Location:</span>
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
                                <label className="text-xs font-bold text-slate-700">Primary Emergency Symptom:</label>
                                <input
                                    type="text"
                                    value={symptomText}
                                    onChange={(e) => setSymptomText(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            {/* Emergency Contact Notice */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">Emergency Relative Contact:</span>
                                <span className="font-bold text-slate-800">{patientData?.emergencyContact?.name || 'Lakshmi Sundaram'} ({patientData?.emergencyContact?.phone || '+91 98765 43210'})</span>
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
                                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-emergency transition-all flex items-center justify-center gap-1.5 animate-pulse"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    <span>{isSubmitting ? 'DISPATCHING...' : 'REQUEST EMERGENCY HELP'}</span>
                                </button>
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};
