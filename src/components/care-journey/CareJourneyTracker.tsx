import React from 'react';
import { useCareJourney } from '../../context/CareJourneyContext';
import {
    Activity,
    Stethoscope,
    FileSpreadsheet,
    FileText,
    Truck,
    Calendar,
    CheckCircle2,
    Clock,
    Circle
} from 'lucide-react';

export const CareJourneyTracker: React.FC = () => {
    const { journey } = useCareJourney();

    const stages = [
        { key: 'healthAssessment', label: 'Health Assessment', desc: 'AI triage & vitals check', icon: Activity },
        { key: 'doctorConsultation', label: 'Doctor Consultation', desc: 'Video/audio checkup', icon: Stethoscope },
        { key: 'treatmentDecision', label: 'Care Decision', desc: 'Clinical evaluation', icon: FileSpreadsheet },
        { key: 'prescription', label: 'Prescription', desc: 'Rx generated & signed', icon: FileText },
        { key: 'medicineDelivery', label: 'Medicine Delivery', desc: 'Doorstep courier', icon: Truck },
        { key: 'followup', label: 'Follow-up Care', desc: 'Post-consult check', icon: Calendar },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-medical space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <span>MY CARE JOURNEY</span>
                        <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-md border border-brand-200">
                            Continuity of Care
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Connecting your health journey before, during, and after consultation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
                {stages.map((st) => {
                    const status = journey[st.key as keyof typeof journey];
                    const Icon = st.icon;

                    return (
                        <div
                            key={st.key}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${status === 'completed'
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                    : status === 'active'
                                        ? 'bg-brand-50 border-brand-300 text-brand-950 ring-2 ring-brand-200 shadow-sm'
                                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${status === 'completed'
                                        ? 'bg-emerald-500 text-white'
                                        : status === 'active'
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    <Icon className="w-4 h-4" />
                                </div>

                                {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {status === 'active' && <Clock className="w-4 h-4 text-brand-600 animate-spin" />}
                                {status === 'pending' && <Circle className="w-4 h-4 text-slate-300" />}
                            </div>

                            <div>
                                <h4 className="text-xs font-bold leading-snug">{st.label}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{st.desc}</p>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-extrabold uppercase">
                                <span className={
                                    status === 'completed' ? 'text-emerald-700' : status === 'active' ? 'text-brand-700' : 'text-slate-400'
                                }>
                                    {status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
