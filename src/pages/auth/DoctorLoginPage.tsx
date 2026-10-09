import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Mail, Lock, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';

export const DoctorLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginAsDemoDoctor } = useAuth();
    const { t } = useI18n();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password, 'doctor');
            navigate('/doctor/dashboard');
        } catch (err: any) {
            setError(err.message || t('authFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoDoctorLogin = async () => {
        setIsSubmitting(true);
        try {
            await loginAsDemoDoctor();
            navigate('/doctor/dashboard');
        } catch (err: any) {
            setError(t('authFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 relative">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('backRole')}</span>
                </Link>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t('doctorSignIn')}</h1>
                    <p className="text-xs text-slate-400 mt-1">Medical Practitioner Clinical Portal</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emailAddress')}</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="arun@carebridge.org"
                                required
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{t('password')}</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? t('authenticatingDoctor') : t('doctorSignIn')}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px bg-slate-700 flex-1" />
                    <span className="text-[11px] text-slate-400 font-medium">{t('verifiedDemoDoctor')}</span>
                    <div className="h-px bg-slate-700 flex-1" />
                </div>

                <button
                    onClick={handleDemoDoctorLogin}
                    className="w-full py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600/60 transition-all flex items-center justify-center gap-2"
                >
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>{t('demoDoctor')}</span>
                </button>

                <p className="text-center text-xs text-slate-400 mt-6">
                    {t('newDoctor')}{' '}
                    <Link to="/doctor/register" className="text-cyan-400 hover:underline font-semibold">
                        {t('uploadCredentials')}
                    </Link>
                </p>
            </div>
        </div>
    );
};
