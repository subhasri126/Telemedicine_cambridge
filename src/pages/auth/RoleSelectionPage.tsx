import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Stethoscope, HeartPulse, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';

export const RoleSelectionPage: React.FC<{ mode?: 'login' | 'register' }> = ({ mode = 'login' }) => {
    const navigate = useNavigate();
    const { loginAsDemoPatient, loginAsDemoDoctor } = useAuth();
    const { t } = useI18n();

    const handleDemoPatient = async () => {
        await loginAsDemoPatient();
        navigate('/patient/dashboard');
    };

    const handleDemoDoctor = async () => {
        await loginAsDemoDoctor();
        navigate('/doctor/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                        <HeartPulse className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
                        CareBridge <span className="text-brand-400 font-normal">Rural</span>
                    </span>
                </Link>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('securePortal')}</span>
                </div>
            </header>

            {/* Main Selection */}
            <main className="max-w-4xl w-full mx-auto my-auto py-8 z-10">
                <div className="text-center mb-10">
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3 inline-block">
                        {mode === 'login' ? t('roleLogin') : t('roleRegister')}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                        {t('selectRole')}
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
                        {t('roleDescription')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Patient Option */}
                    <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <User className="w-7 h-7" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{t('patientPortal')}</h2>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Access AI health screening, urgent doctor triage, WebRTC video consultation, digital prescriptions, and emergency SOS response.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(mode === 'login' ? '/patient/login' : '/patient/register')}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
                            >
                                <span>{mode === 'login' ? t('patientSignIn') : t('registerPatient')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDemoPatient}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-600/50 transition-all"
                            >
                                {t('demoPatient')}
                            </button>
                        </div>
                    </div>

                    {/* Doctor Option */}
                    <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Stethoscope className="w-7 h-7" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{t('doctorPortal')}</h2>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                Manage real-time patient priority triage queue (RED/ORANGE/YELLOW/GREEN), issue digital prescriptions, accept WebRTC video calls, and respond to emergency alerts.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(mode === 'login' ? '/doctor/login' : '/doctor/register')}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
                            >
                                <span>{mode === 'login' ? t('doctorSignIn') : t('registerDoctor')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDemoDoctor}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-600/50 transition-all"
                            >
                                {t('demoDoctor')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-500 py-4 z-10">
                CareBridge Rural Multi-User Telemedicine Platform • Powered by React, Node.js, Express, MySQL & WebRTC
            </footer>
        </div>
    );
};
