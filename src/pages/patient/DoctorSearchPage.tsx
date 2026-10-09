import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDoctors } from '../../services/doctorService';
import { useI18n } from '../../i18n';
import { DoctorProfile } from '../../types';
import { Stethoscope, Star, Clock, Video, Building2, Search, Filter, CheckCircle2 } from 'lucide-react';

export const DoctorSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

    const doctors = searchDoctors(searchQuery, selectedSpecialty);

    const specialties = [
        'All',
        'General Medicine & Critical Care',
        'Pediatrics & Rural Child Care',
        'Cardiology',
        'Gynecology',
        'Dermatology'
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-medical space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl text-slate-900">{t('findSpecialistDoctors')}</h1>
                            <p className="text-xs text-slate-500">{t('doctorsAvailable')}</p>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                        <div className="sm:col-span-7 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('searchDoctors')}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="sm:col-span-5 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                {specialties.map((spec) => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Doctor List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doc: DoctorProfile) => (
                        <div key={doc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-medical space-y-4 flex flex-col justify-between hover:border-brand-300 transition-all">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                                        alt={doc.fullName}
                                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-extrabold text-sm text-slate-900">{doc.fullName}</h3>
                                            <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                                        </div>
                                        <p className="text-xs text-brand-700 font-bold">{doc.specialty}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.qualification}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">{t('hospital')}:</span>
                                        <span className="font-bold text-slate-800">{doc.hospitalAffiliation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">{t('experience')}:</span>
                                        <span className="font-bold text-slate-800">{doc.experienceYears} {t('years')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">{t('languages')}:</span>
                                        <span className="font-bold text-slate-800">{doc.languages.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                                        <span className="text-slate-500">{t('waitingQueue')}:</span>
                                        <span className="font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                                            {doc.currentQueueCount} {t('patients')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/consultation/consult-01')}
                                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <Video className="w-4 h-4" />
                                <span>{t('startTeleConsultation')}</span>
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
