import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Truck, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';

export const HospitalHandoffPage: React.FC = () => {
    const { patientData } = useAuth();
    const navigate = useNavigate();

    const [targetHospital, setTargetHospital] = useState('District Care Emergency Hospital, Thanjavur');
    const [transportUnit, setTransportUnit] = useState('AMB-TR-104 (Advanced Life Support Ambulance)');
    const [handoffNotes, setHandoffNotes] = useState('Patient Priya Sundaram presenting with acute hypoxia (SpO2 89%). Pre-notified ER duty team to reserve ICU bed with ventilator standby.');
    const [isSent, setIsSent] = useState(false);

    const handleTransmitHandoff = () => {
        setIsSent(true);
        setTimeout(() => {
            navigate('/doctor/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-medical space-y-6">
                    <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900">Hospital Emergency Handoff</h1>
                            <p className="text-xs text-slate-500">Direct referral & ambulance dispatch for critical cases</p>
                        </div>
                    </div>

                    {isSent ? (
                        <div className="py-8 text-center space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                            <h3 className="font-extrabold text-lg text-slate-900">Emergency Handoff Transmitted!</h3>
                            <p className="text-xs text-slate-600">
                                ICU Bed Reserved at District Care Hospital. Ambulance AMB-TR-104 en route.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Target Referral Hospital:</label>
                                <select
                                    value={targetHospital}
                                    onChange={(e) => setTargetHospital(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800"
                                >
                                    <option value="District Care Emergency Hospital, Thanjavur">District Care Emergency Hospital, Thanjavur (ICU Available)</option>
                                    <option value="Regional Critical Care Centre, Kumbakonam">Regional Critical Care Centre, Kumbakonam</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Assigned Transport Unit:</label>
                                <select
                                    value={transportUnit}
                                    onChange={(e) => setTransportUnit(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800"
                                >
                                    <option value="AMB-TR-104 (Advanced Life Support Ambulance)">AMB-TR-104 (ALS Ambulance - Ventilator Equipped)</option>
                                    <option value="AMB-TR-108 (Basic Life Support Ambulance)">AMB-TR-108 (BLS Ambulance)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Handoff Clinical Summary:</label>
                                <textarea
                                    rows={4}
                                    value={handoffNotes}
                                    onChange={(e) => setHandoffNotes(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-semibold text-slate-800"
                                />
                            </div>

                            <button
                                onClick={handleTransmitHandoff}
                                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-emergency transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Transmit Emergency Handoff & Reserve Bed</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
