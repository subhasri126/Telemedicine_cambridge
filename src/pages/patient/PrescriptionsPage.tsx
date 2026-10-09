import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';
import { getPrescriptions, downloadPrescriptionPDF } from '../../services/prescriptionService';
import { Prescription } from '../../types';
import { FileText, Download, Truck, Calendar, ShieldCheck, Stethoscope } from 'lucide-react';

export const PrescriptionsPage: React.FC = () => {
    const { patientData } = useAuth();
    const navigate = useNavigate();
    const { t } = useI18n();

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    useEffect(() => {
        const list = getPrescriptions(patientData?.id);
        setPrescriptions(list);
    }, [patientData?.id]);

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900">{t('digitalPrescriptions')}</h1>
                            <p className="text-xs text-slate-500">{t('verifiedPrescriptions')}</p>
                        </div>
                    </div>
                </div>

                {prescriptions.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-slate-500 space-y-2 border border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                        <p className="font-bold text-sm">{t('noPrescriptions')}</p>
                        <p className="text-xs">{t('completeConsultation')}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {prescriptions.map((rx) => (
                            <div key={rx.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-medical space-y-6">

                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md border border-brand-200">
                                                Rx #{rx.id.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-slate-500">Issued {new Date(rx.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-extrabold text-lg text-slate-900 mt-2">{rx.doctorName}</h3>
                                        <p className="text-xs text-slate-600">{rx.doctorSpecialty} • {rx.hospitalName}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => downloadPrescriptionPDF(rx)}
                                            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>{t('downloadPdf')}</span>
                                        </button>

                                        <button
                                            onClick={() => navigate('/patient/pharmacy')}
                                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span>{t('orderMedicine')}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Patient & Diagnosis Block */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                                    <p><strong className="text-slate-700">{t('patient')}:</strong> {rx.patientName} ({rx.patientAge} {t('years')})</p>
                                    <p><strong className="text-slate-700">{t('diagnosis')}:</strong> {rx.diagnosis}</p>
                                    <p><strong className="text-slate-700">{t('validUntil')}:</strong> {rx.validUntil}</p>
                                </div>

                                {/* Medication Items Table */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{t('prescribedMedications')}</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                                    <th className="p-3 rounded-l-xl">{t('medicine')}</th>
                                                    <th className="p-3">{t('dosage')}</th>
                                                    <th className="p-3">{t('frequency')}</th>
                                                    <th className="p-3">{t('duration')}</th>
                                                    <th className="p-3 rounded-r-xl">{t('instructions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {rx.items.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50">
                                                        <td className="p-3 font-bold text-slate-900">{item.medicineName}</td>
                                                        <td className="p-3 text-slate-700">{item.dosage}</td>
                                                        <td className="p-3 text-slate-700">{item.frequency}</td>
                                                        <td className="p-3 text-slate-700">{item.duration}</td>
                                                        <td className="p-3 text-slate-500 italic">{item.instructions || t('asDirected')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Advice Notes */}
                                {rx.adviceNotes && (
                                    <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-200 text-xs text-brand-950 space-y-1">
                                        <p className="font-extrabold text-brand-800">Doctor Advice:</p>
                                        <p>{rx.adviceNotes}</p>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};
