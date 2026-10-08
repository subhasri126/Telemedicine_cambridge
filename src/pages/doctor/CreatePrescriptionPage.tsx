import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPrescription } from '../../services/prescriptionService';
import { PrescriptionItem } from '../../types';
import { FileText, Plus, Trash2, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export const CreatePrescriptionPage: React.FC = () => {
    const { doctorData, patientData } = useAuth();
    const navigate = useNavigate();

    const [diagnosis, setDiagnosis] = useState('Acute Exacerbation of Asthma / Severe Bronchospasm');
    const [adviceNotes, setAdviceNotes] = useState('Take warm fluids. Avoid cold exposure. Use inhaler every 8 hours as prescribed.');
    const [validUntil, setValidUntil] = useState('30 Days');
    const [isSaved, setIsSaved] = useState(false);

    const [items, setItems] = useState<Omit<PrescriptionItem, 'id'>[]>([
        { medicineName: 'Salbutamol Nebulizer Respules', dosage: '2.5ml', frequency: '8 Hourly', duration: '3 Days', instructions: 'Use via nebulizer' },
        { medicineName: 'Prednisolone Oral 40mg', dosage: '40mg', frequency: 'Once Daily', duration: '5 Days', instructions: 'Take after morning food' }
    ]);

    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            { medicineName: '', dosage: '', frequency: 'Twice Daily', duration: '5 Days', instructions: '' }
        ]);
    };

    const handleRemoveItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateItem = (index: number, field: string, value: string) => {
        setItems((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleSaveRx = () => {
        createPrescription({
            patientId: patientData?.id || 'patient-priya-01',
            patientName: patientData?.fullName || 'Priya Sundaram',
            patientAge: patientData?.age || 42,
            doctorId: doctorData?.id || 'doc-arun-01',
            doctorName: doctorData?.fullName || 'Dr. Arun Kumar',
            doctorSpecialty: doctorData?.specialty || 'General Medicine',
            hospitalName: doctorData?.hospitalAffiliation || 'District Care Hospital',
            diagnosis,
            validUntil,
            adviceNotes,
            items: items.map((it, idx) => ({ ...it, id: `item-${idx}` }))
        });

        setIsSaved(true);
        setTimeout(() => {
            navigate('/doctor/dashboard');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-xl text-slate-900">Generate Digital Prescription (Rx)</h1>
                                <p className="text-xs text-slate-500">Issued by {doctorData?.fullName || 'Dr. Arun Kumar'}</p>
                            </div>
                        </div>
                    </div>

                    {isSaved ? (
                        <div className="py-8 text-center space-y-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                            <h3 className="font-extrabold text-lg text-slate-900">Prescription Issued Successfully!</h3>
                            <p className="text-xs text-slate-600">
                                Patient notification dispatched & PDF generated. Redirecting to dashboard...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Diagnosis & Validity */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700">Clinical Diagnosis:</label>
                                    <input
                                        type="text"
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700">Prescription Validity:</label>
                                    <input
                                        type="text"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            {/* Medication Table Form */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Prescribed Medications</h3>
                                    <button
                                        onClick={handleAddItem}
                                        className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Medicine</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                            <div className="sm:col-span-4 space-y-1">
                                                <label className="font-bold text-slate-600">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    value={item.medicineName}
                                                    onChange={(e) => handleUpdateItem(idx, 'medicineName', e.target.value)}
                                                    placeholder="e.g. Paracetamol 500mg"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                                />
                                            </div>
                                            <div className="sm:col-span-2 space-y-1">
                                                <label className="font-bold text-slate-600">Dosage</label>
                                                <input
                                                    type="text"
                                                    value={item.dosage}
                                                    onChange={(e) => handleUpdateItem(idx, 'dosage', e.target.value)}
                                                    placeholder="500mg"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                                />
                                            </div>
                                            <div className="sm:col-span-2 space-y-1">
                                                <label className="font-bold text-slate-600">Frequency</label>
                                                <input
                                                    type="text"
                                                    value={item.frequency}
                                                    onChange={(e) => handleUpdateItem(idx, 'frequency', e.target.value)}
                                                    placeholder="8 Hourly"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                                />
                                            </div>
                                            <div className="sm:col-span-3 space-y-1">
                                                <label className="font-bold text-slate-600">Instructions</label>
                                                <input
                                                    type="text"
                                                    value={item.instructions}
                                                    onChange={(e) => handleUpdateItem(idx, 'instructions', e.target.value)}
                                                    placeholder="After food"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                                                />
                                            </div>
                                            <div className="sm:col-span-1 flex items-end justify-center">
                                                <button
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Advice Notes */}
                            <div className="space-y-1 pt-2">
                                <label className="text-xs font-bold text-slate-700">Special Advice / Precautions:</label>
                                <textarea
                                    rows={3}
                                    value={adviceNotes}
                                    onChange={(e) => setAdviceNotes(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSaveRx}
                                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Issue Signed Digital Prescription</span>
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};
