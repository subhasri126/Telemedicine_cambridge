import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { evaluateHealthRisk } from '../../services/riskAssessmentService';
import { SymptomAssessment } from '../../types';
import {
    Activity,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Stethoscope,
    Heart,
    Thermometer,
    Sparkles,
    Info
} from 'lucide-react';

interface HealthCheckPageProps {
    onOpenSOSModal: () => void;
}

export const HealthCheckPage: React.FC<HealthCheckPageProps> = ({ onOpenSOSModal }) => {
    const { patientData } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState<number>(1);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Breathing difficulty', 'Chest tightness']);
    const [freeText, setFreeText] = useState('Struggling to get deep breath since morning. Feeling dizzy when standing.');
    const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Severe');

    // Vitals
    const [temperatureF, setTemperatureF] = useState<number>(101.4);
    const [heartRateBpm, setHeartRateBpm] = useState<number>(112);
    const [spo2Percentage, setSpo2Percentage] = useState<number>(89);
    const [bloodPressure, setBloodPressure] = useState<string>('135/88');

    // Result
    const [assessmentResult, setAssessmentResult] = useState<SymptomAssessment | null>(null);

    const availableSymptoms = [
        'Fever',
        'Cough',
        'Breathing difficulty',
        'Chest discomfort',
        'Headache',
        'Body pain / Fatigue',
        'Stomach problem / Diarrhea',
        'Injury / Cut'
    ];

    const toggleSymptom = (sym: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
        );
    };

    const handleRunAssessment = () => {
        const result = evaluateHealthRisk({
            patientId: patientData?.id || 'patient-priya-01',
            patientName: patientData?.fullName || 'Priya Sundaram',
            symptoms: selectedSymptoms,
            freeTextDescription: freeText,
            severity,
            vitals: {
                temperatureF: Number(temperatureF),
                heartRateBpm: Number(heartRateBpm),
                spo2Percentage: Number(spo2Percentage),
                bloodPressure
            }
        });

        setAssessmentResult(result);
        setStep(5); // Result View
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Top Title Banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-medical flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-lg text-slate-900">AI Health & Risk Triage Assessment</h1>
                            <p className="text-xs text-slate-500">Multi-step vital screening & recommended clinical next step</p>
                        </div>
                    </div>

                    {step < 5 && (
                        <div className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                            Step {step} of 4
                        </div>
                    )}
                </div>

                {/* Medical Safety Disclaimer Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                        <strong>Medical Disclaimer:</strong> This AI-assisted screening does not replace a qualified medical professional.
                    </span>
                </div>

                {/* STEP 1: Symptom Selection */}
                {step === 1 && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6 animate-in fade-in">
                        <div className="space-y-1">
                            <h2 className="text-base font-extrabold text-slate-900">Step 1: What symptoms are you experiencing?</h2>
                            <p className="text-xs text-slate-500">Select all that apply or describe below.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {availableSymptoms.map((sym) => {
                                const isSelected = selectedSymptoms.includes(sym);
                                return (
                                    <button
                                        type="button"
                                        key={sym}
                                        onClick={() => toggleSymptom(sym)}
                                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${isSelected
                                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        {sym}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Additional Symptom Notes (Optional):</label>
                            <textarea
                                rows={3}
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                placeholder="Describe how long you've felt this way or any special details..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setStep(2)}
                                disabled={selectedSymptoms.length === 0}
                                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <span>Continue to Severity</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Severity */}
                {step === 2 && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6 animate-in fade-in">
                        <div className="space-y-1">
                            <h2 className="text-base font-extrabold text-slate-900">Step 2: How severe are your symptoms?</h2>
                            <p className="text-xs text-slate-500">Choose the option that best matches your discomfort level.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { level: 'Mild', desc: 'Manageable discomfort. Able to carry out daily tasks.', color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900' },
                                { level: 'Moderate', desc: 'Noticeable pain or weakness requiring rest.', color: 'border-amber-300 bg-amber-50/60 text-amber-900' },
                                { level: 'Severe', desc: 'Intense distress, breathing difficulty, or severe pain.', color: 'border-rose-300 bg-rose-50/60 text-rose-900' },
                            ].map((opt) => (
                                <div
                                    key={opt.level}
                                    onClick={() => setSeverity(opt.level as any)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${severity === opt.level ? `${opt.color} shadow-md ring-2 ring-brand-500` : 'border-slate-200 bg-slate-50 text-slate-600 opacity-70'
                                        }`}
                                >
                                    <h3 className="font-extrabold text-sm mb-1">{opt.level} Severity</h3>
                                    <p className="text-xs leading-relaxed opacity-90">{opt.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-2">
                            <button
                                onClick={() => setStep(1)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <span>Continue to Vitals</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Vitals Input */}
                {step === 3 && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6 animate-in fade-in">
                        <div className="space-y-1">
                            <h2 className="text-base font-extrabold text-slate-900">Step 3: Enter Health Vitals</h2>
                            <p className="text-xs text-slate-500">Provide pulse oximeter or blood pressure readings if available.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Oxygen Saturation (SpO2 %):</span>
                                </label>
                                <input
                                    type="number"
                                    value={spo2Percentage}
                                    onChange={(e) => setSpo2Percentage(Number(e.target.value))}
                                    placeholder="e.g. 98"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <span className="text-[10px] text-slate-400">Normal SpO2 is 95% - 100%</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5 text-brand-600" />
                                    <span>Heart Rate / Pulse (bpm):</span>
                                </label>
                                <input
                                    type="number"
                                    value={heartRateBpm}
                                    onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                                    placeholder="e.g. 72"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <span className="text-[10px] text-slate-400">Normal resting pulse is 60 - 100 bpm</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Body Temperature (°F):</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={temperatureF}
                                    onChange={(e) => setTemperatureF(Number(e.target.value))}
                                    placeholder="e.g. 98.6"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <span className="text-[10px] text-slate-400">Normal body temp is 98.6°F</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Blood Pressure (Systolic/Diastolic):</label>
                                <input
                                    type="text"
                                    value={bloodPressure}
                                    onChange={(e) => setBloodPressure(e.target.value)}
                                    placeholder="e.g. 120/80"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                        </div>

                        <div className="flex justify-between pt-2">
                            <button
                                onClick={() => setStep(2)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <span>Final Review</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: History & Submit */}
                {step === 4 && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6 animate-in fade-in">
                        <div className="space-y-1">
                            <h2 className="text-base font-extrabold text-slate-900">Step 4: Patient Context & History</h2>
                            <p className="text-xs text-slate-500">Confirm details before running AI risk calculation.</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">Patient:</span>
                                <span className="font-bold text-slate-800">{patientData?.fullName || 'Priya Sundaram'} ({patientData?.age || 42} Yrs)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">Reported Symptoms:</span>
                                <span className="font-bold text-slate-800">{selectedSymptoms.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">Vitals:</span>
                                <span className="font-bold text-slate-800">SpO2: {spo2Percentage}%, Pulse: {heartRateBpm} bpm, Temp: {temperatureF}°F</span>
                            </div>
                        </div>

                        <div className="flex justify-between pt-2">
                            <button
                                onClick={() => setStep(3)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleRunAssessment}
                                className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-medical transition-all flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-brand-100" />
                                <span>Evaluate Health Risk</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: Risk Result Screen */}
                {step === 5 && assessmentResult && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical-lg space-y-6 animate-in zoom-in-95 duration-200">

                        {/* Risk Level Header Banner */}
                        <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${assessmentResult.riskLevel === 'RED'
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : assessmentResult.riskLevel === 'YELLOW'
                                ? 'bg-amber-50 border-amber-300 text-amber-950'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            }`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shadow-sm ${assessmentResult.riskLevel === 'RED'
                                ? 'bg-rose-600 animate-pulse'
                                : assessmentResult.riskLevel === 'YELLOW'
                                    ? 'bg-amber-600'
                                    : 'bg-emerald-600'
                                }`}>
                                {assessmentResult.riskLevel}
                            </div>

                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">
                                    AI Risk Screening Output
                                </span>
                                <h3 className="font-extrabold text-lg">
                                    {assessmentResult.riskLevel === 'RED' && 'RED — Urgent Medical Evaluation Recommended'}
                                    {assessmentResult.riskLevel === 'YELLOW' && 'YELLOW — Timely Consultation Recommended'}
                                    {assessmentResult.riskLevel === 'GREEN' && 'GREEN — Routine Care Recommended'}
                                </h3>
                            </div>
                        </div>

                        {/* Clinical Summary */}
                        <div className="space-y-3 text-xs">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-1">Risk Summary:</h4>
                                <p className="text-slate-600 leading-relaxed">{assessmentResult.riskSummary}</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-1">Recommended Next Step:</h4>
                                <p className="text-slate-600 leading-relaxed font-semibold">{assessmentResult.recommendedAction}</p>
                            </div>
                        </div>

                        {/* Explicit Disclaimer */}
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                            <strong>Important Notice:</strong> This screening result is generated by CareBridge's AI-assisted triage engine and does not constitute a formal diagnostic claim or replace a licensed doctor.
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            {assessmentResult.riskLevel === 'RED' ? (
                                <>
                                    <button
                                        onClick={onOpenSOSModal}
                                        className="w-full sm:flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-emergency transition-all flex items-center justify-center gap-2 animate-pulse"
                                    >
                                        <ShieldAlert className="w-4 h-4" />
                                        <span>Request Emergency Help (SOS)</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/consultation/consult-01')}
                                        className="w-full sm:flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Stethoscope className="w-4 h-4" />
                                        <span>Connect to Duty Doctor</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/patient/doctors')}
                                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Stethoscope className="w-4 h-4" />
                                    <span>Match & Book Consultation</span>
                                </button>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};
