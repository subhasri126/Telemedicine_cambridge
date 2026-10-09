import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CareBridgeLogo } from '../components/branding/CareBridgeLogo';
import {
    Activity, ArrowRight, Bot, CheckCircle2, FileText, HeartPulse, MapPin,
    ShieldAlert, Stethoscope, Truck, Video, Wifi
} from 'lucide-react';
import { useI18n } from '../i18n';

interface LandingPageProps {
    onOpenAIModal: () => void;
    onOpenSOSModal: () => void;
}

const services = [
    { icon: Video, title: 'Online Doctor Consultation', text: 'Connect with available doctors remotely through the consultation features in your secure portal.' },
    { icon: Bot, title: 'AI-Assisted Symptom Assessment', text: 'Organize symptoms and understand urgency with decision support—not a medical diagnosis.' },
    { icon: FileText, title: 'Digital Health Records', text: 'Access authorized health information, consultation notes, and prescriptions in one place.' },
    { icon: ShieldAlert, title: 'Emergency SOS', text: 'Create an emergency case and view its actual response status after authentication.' },
    { icon: Truck, title: 'Hospital and Transport Coordination', text: 'Coordinate supported referrals and transport through the emergency workflow.' },
    { icon: HeartPulse, title: 'Prescriptions and Follow-up', text: 'Continue care with available prescription, pharmacy, and follow-up tools.' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAIModal }) => {
    const { t } = useI18n();
    return (
    <div className="bg-white text-slate-800">
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-brand-50">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 md:gap-10 md:py-12 lg:grid-cols-2 lg:px-8 lg:py-14">
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold text-brand-700 shadow-sm">
                        <HeartPulse className="h-4 w-4" /> {t('healthcareWithinReach')}
                    </span>
                    <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                        {t('heroTitle')}
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                        {t('heroDescription')}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-medical transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                            {t('getStarted')} <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a href="#services" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                            {t('exploreServices')}
                        </a>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {t('secureAccess')}</span>
                        <span className="inline-flex items-center gap-1.5"><Wifi className="h-4 w-4 text-brand-600" /> {t('ruralConnectivity')}</span>
                    </div>
                </motion.div>

                <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-medical-lg sm:p-5">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Stethoscope className="h-6 w-6" /></div>
                            <div><p className="text-xs font-bold uppercase tracking-wider text-brand-600">CareBridge Rural</p><h2 className="font-extrabold text-slate-900">{t('careJourney')}</h2></div>
                        </div>
                        <div className="mt-4 space-y-2.5">
                            {[
                                [t('consultation'), 'Connect with an available doctor', Video, 'bg-sky-50 text-sky-700'],
                                [t('healthRecords'), 'Keep authorized information accessible', FileText, 'bg-teal-50 text-teal-700'],
                                [t('emergencySupport'), 'Raise an SOS after signing in', ShieldAlert, 'bg-rose-50 text-rose-700']
                            ].map(([title, text, Icon, color]) => {
                                const ServiceIcon = Icon as React.ComponentType<{ className?: string }>;
                                return <div key={title as string} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}><ServiceIcon className="h-5 w-5" /></div><div><p className="text-sm font-bold text-slate-900">{title as string}</p><p className="text-xs text-slate-500">{text as string}</p></div></div>;
                            })}
                        </div>
                    </div>
                    <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-700 shadow-md sm:flex"><MapPin className="h-4 w-4" /> Built for connected rural care</div>
                </div>
            </div>
        </section>

        <section id="how-it-works" className="border-b border-slate-100 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">{t('howItWorks')}</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">{t('careThatContinues')}</h2></div>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {[
                        ['01', 'Register securely', 'Choose a patient or doctor account and complete the relevant registration details.'],
                        ['02', 'Connect with care', 'Patients can find available doctors; doctors can review the authenticated patient queue.'],
                        ['03', 'Continue your journey', 'Use available consultations, prescriptions, referrals, and follow-up tools.']
                    ].map(([number, title, text]) => <div key={number} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><span className="text-sm font-extrabold text-brand-600">{number}</span><h3 className="mt-4 font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>)}
                </div>
            </div>
        </section>

        <section id="services" className="bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-600">{t('ourServices')}</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">{t('connectedTools')}</h2></div><p className="max-w-md text-sm text-slate-600">Features are available inside the authenticated patient and doctor  portals.</p></div>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-medical transition hover:-translate-y-1"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>)}
                </div>
            </div>
        </section>

        <section id="emergency-support" className="bg-rose-50 py-14">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
                <div><p className="text-xs font-bold uppercase tracking-widest text-rose-700">Emergency Support</p><h2 className="mt-2 text-2xl font-extrabold text-slate-950">Need urgent help?</h2><p className="mt-2 max-w-2xl text-sm text-slate-600">Sign in as a patient to create an emergency case and view its real status. CareBridge is not a substitute for local emergency services.</p></div>
                <Link to="/patient/login" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">Patient Emergency Access <ArrowRight className="h-4 w-4" /></Link>
            </div>
        </section>

        <section id="roles" className="bg-white py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">Choose your portal</p><h2 className="mt-2 text-3xl font-extrabold text-slate-950">The right tools for your role</h2></div><div className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-brand-200 bg-brand-50 p-7"><h3 className="text-xl font-extrabold text-slate-950">Patient</h3><p className="mt-2 text-sm text-slate-600">Find and consult doctors, manage authorized health information, and request emergency assistance.</p><Link to="/patient/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">Continue as Patient <ArrowRight className="h-4 w-4" /></Link></div><div className="rounded-3xl border border-teal-200 bg-teal-50 p-7"><h3 className="text-xl font-extrabold text-slate-950">Doctor</h3><p className="mt-2 text-sm text-slate-600">Access the patient queue, manage consultations, and review permitted records after verification.</p><Link to="/doctor/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">Continue as Doctor <ArrowRight className="h-4 w-4" /></Link></div></div></div>
        </section>

        <section className="bg-brand-700 py-14 text-center text-white"><div className="mx-auto max-w-2xl px-4"><h2 className="text-3xl font-extrabold">Healthcare Access, Without Distance.</h2><p className="mt-3 text-sm text-brand-100">Create an account to access the CareBridge Rural platform.</p><Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-brand-700 hover:bg-brand-50">Register for CareBridge <ArrowRight className="h-4 w-4" /></Link></div></section>
    </div>
    );
};
