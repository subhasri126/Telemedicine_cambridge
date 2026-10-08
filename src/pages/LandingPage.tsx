import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CareBridgeLogo } from '../components/branding/CareBridgeLogo';
import { useAuth } from '../context/AuthContext';
import {
    Stethoscope,
    ShieldAlert,
    Bot,
    Activity,
    Truck,
    FileText,
    CheckCircle2,
    ArrowRight,
    Globe,
    HeartHandshake,
    Clock,
    Building2,
    Wifi,
    Sparkles
} from 'lucide-react';

interface LandingPageProps {
    onOpenAIModal: () => void;
    onOpenSOSModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAIModal, onOpenSOSModal }) => {
    const { loginAsDemoPatient, loginAsDemoDoctor } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Hero Text */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold">
                                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                                <span>Connected Rural Healthcare Journey Platform</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                                Healthcare shouldn't depend on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-600">where you live.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                Connect with specialist doctors, receive AI-assisted health triage, access WebRTC video calls optimized for low-bandwidth networks, and receive doorstep medicine delivery.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        loginAsDemoPatient();
                                        navigate('/patient/doctors');
                                    }}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-medical transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <Stethoscope className="w-4 h-4" />
                                    <span>Find a Doctor</span>
                                </button>

                                <button
                                    onClick={onOpenSOSModal}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-emergency transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    <span>Emergency Help (SOS)</span>
                                </button>
                            </div>

                            {/* Quick Demo Switcher Banner for Judges */}
                            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs">
                                <span className="text-slate-500 font-bold">1-Click Hackathon Login:</span>
                                <button
                                    onClick={() => {
                                        loginAsDemoPatient();
                                        navigate('/patient/dashboard');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-brand-700 font-bold shadow-sm hover:bg-brand-50 transition-colors"
                                >
                                    Patient Dashboard (Priya)
                                </button>
                                <button
                                    onClick={() => {
                                        loginAsDemoDoctor();
                                        navigate('/doctor/dashboard');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-teal-700 font-bold shadow-sm hover:bg-teal-50 transition-colors"
                                >
                                    Doctor Dashboard (Dr. Arun)
                                </button>
                            </div>

                        </div>

                        {/* Right Hero Card / Visual Preview */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-6 shadow-medical-lg border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Live Health Status Tracker</span>
                                    </div>
                                    <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-md">Rural Unit #42</span>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Patient:</span>
                                        <span className="font-bold text-slate-900">Priya Sundaram (42 Yrs)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">AI Triage Result:</span>
                                        <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">HIGH PRIORITY (SpO2: 89%)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Assigned Physician:</span>
                                        <span className="font-bold text-slate-800">Dr. Arun Kumar, MD</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Emergency Ambulance:</span>
                                        <span className="font-bold text-emerald-700">TR-104 (ETA: 18 min)</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200 flex items-center justify-between text-xs text-brand-900">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-brand-600" />
                                        <span className="font-bold">CareBridge Voice Assistant</span>
                                    </div>
                                    <button
                                        onClick={onOpenAIModal}
                                        className="text-xs text-brand-700 font-extrabold hover:underline"
                                    >
                                        Try AI Assistant →
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Care Journey Showcase */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div>
                        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                            One Connected Journey
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                            Healthcare Shouldn't End With a Video Call
                        </h2>
                        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2">
                            From symptom check to doctor consultation, emergency dispatch, signed prescription, and doorstep delivery.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
                        {[
                            { step: '01', title: 'AI Assistant', desc: 'Voice & text symptom triage in Tamil & English', icon: Bot },
                            { step: '02', title: 'Health Assessment', desc: 'Vitals screening & risk score output', icon: Activity },
                            { step: '03', title: 'Doctor Match', desc: 'Specialist consultation via WebRTC', icon: Stethoscope },
                            { step: '04', title: 'Emergency SOS', desc: 'Ambulance dispatch & hospital handoff', icon: ShieldAlert },
                            { step: '05', title: 'Prescription', desc: 'Signed digital RX PDF download', icon: FileText },
                            { step: '06', title: 'Medicine Courier', desc: 'Doorstep medicine delivery status', icon: Truck },
                        ].map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={item.step} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 hover:border-brand-300 transition-all shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-brand-600">{item.step}</span>
                                        <IconComponent className="w-4 h-4 text-brand-500" />
                                    </div>
                                    <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Feature Grids */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-3xl font-extrabold text-slate-900">Purpose-Built For Rural Healthcare Access</h2>
                        <p className="text-slate-600 text-sm">Eliminating distance, long travel, internet drops, and prescription delays.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-medical space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                                <Wifi className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Adaptive Low-Bandwidth Mode</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Consultations dynamically adjust between high-definition video, audio-only, and text modes depending on signal strength. Never lose doctor access during weak 2G/3G connections.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-medical space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Integrated SOS Triage Timeline</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                When a critical symptom or SpO2 drop is detected, CareBridge alerts duty doctors, notifies nearest emergency hospitals, and assigns rural ambulance transport in real time.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-medical space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Bilingual Tamil & English Support</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Designed for regional accessibility with Web Speech API recognition and text-to-speech support in Tamil and English for seamless communication.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Footer Section */}
            <section className="py-16 bg-gradient-to-r from-brand-600 to-teal-700 text-white">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Ready to experience rural healthcare continuity?
                    </h2>
                    <p className="text-brand-100 text-sm max-w-xl mx-auto">
                        Test the live hackathon platform as a Patient or Doctor with pre-seeded clinical data.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                loginAsDemoPatient();
                                navigate('/patient/dashboard');
                            }}
                            className="px-6 py-3 rounded-2xl bg-white text-brand-700 font-extrabold text-sm shadow-md hover:bg-slate-100 transition-all"
                        >
                            Enter Patient View (Priya)
                        </button>
                        <button
                            onClick={() => {
                                loginAsDemoDoctor();
                                navigate('/doctor/dashboard');
                            }}
                            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm shadow-md hover:bg-slate-800 transition-all border border-slate-700"
                        >
                            Enter Doctor Dashboard (Dr. Arun)
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};
