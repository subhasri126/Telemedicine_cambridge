import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    User,
    Stethoscope,
    Video,
    FileText,
    Building2,
    Activity,
    ShieldAlert,
    Clock,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';

export const PatientDetailPage: React.FC = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { patientData } = useAuth();

    const [clinicalNote, setClinicalNote] = useState('Patient exhibits acute respiratory distress, SpO2 89%, bilateral wheezing. Advise urgent nebulization and prednisolone coverage.');

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Back navigation */}
                <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Triage Queue</span>
                </button>

                {/* Patient Profile Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
                                P
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-extrabold text-xl text-slate-900">{patientData?.fullName || 'Priya Sundaram'}</h1>
                                    <span className="text-xs bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                                        RED PRIORITY
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Age: {patientData?.age || 42} • Gender: {patientData?.gender || 'Female'} • Location: {patientData?.location || 'Kollumangudi Village'}
                                </p>
                            </div>
                        </div>

                        {/* Doctor Quick Action Toolbar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => navigate('/consultation/consult-01')}
                                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <Video className="w-4 h-4" />
                                <span>Start Video Consult</span>
                            </button>

                            <button
                                onClick={() => navigate('/doctor/create-prescription')}
                                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Create Prescription</span>
                            </button>

                            <button
                                onClick={() => navigate('/doctor/hospital-handoff')}
                                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-emergency transition-all flex items-center gap-1.5"
                            >
                                <Building2 className="w-4 h-4" />
                                <span>Hospital Handoff / SOS</span>
                            </button>
                        </div>
                    </div>

                    {/* Vitals Summary Grid */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Clinical Vitals Assessment</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
                                <span className="text-[10px] font-semibold text-rose-700 block uppercase">SpO2 Saturation</span>
                                <span className="text-lg font-extrabold text-rose-700">89%</span>
                                <span className="text-[10px] text-rose-800 block mt-0.5 font-bold">Hypoxia Alert</span>
                            </div>
                            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                                <span className="text-[10px] font-semibold text-amber-700 block uppercase">Heart Rate</span>
                                <span className="text-lg font-extrabold text-amber-700">112 bpm</span>
                                <span className="text-[10px] text-amber-800 block mt-0.5 font-bold">Tachycardia</span>
                            </div>
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Body Temp</span>
                                <span className="text-lg font-bold text-slate-800">101.4°F</span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">High Fever</span>
                            </div>
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Blood Pressure</span>
                                <span className="text-lg font-bold text-slate-800">135/88</span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">Mild Elevation</span>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Note Editor */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Physician Clinical Notes:</label>
                        <textarea
                            rows={4}
                            value={clinicalNote}
                            onChange={(e) => setClinicalNote(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};
