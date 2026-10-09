import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock, User, Phone, MapPin, Calendar, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';

export const PatientRegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { registerPatient } = useAuth();
    const { t } = useI18n();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('Female');
    const [village, setVillage] = useState('');
    const [district, setDistrict] = useState('Nagapattinam');
    const [preferredLanguage, setPreferredLanguage] = useState('Tamil');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await registerPatient({
                fullName,
                email,
                phone,
                password,
                dateOfBirth,
                gender,
                village,
                district,
                preferredLanguage,
                emergencyContactName,
                emergencyContactPhone,
                telegramChatId
            });
            navigate('/patient/dashboard');
        } catch (err: any) {
            setError(err.message || t('registrationFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 relative">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('backRole')}</span>
                </Link>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
                        <HeartPulse className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t('patientRegistration')}</h1>
                    <p className="text-xs text-slate-400 mt-1">{t('createPatientAccount')}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('fullName')} *</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Priya Sundaram"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emailAddress')} *</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="priya@carebridge.org"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('phoneNumber')} *</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 94432 10987"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('password')} *</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                            >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Village / Town</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={village}
                                    onChange={(e) => setVillage(e.target.value)}
                                    placeholder="Kollumangudi Village"
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                            <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder="Nagapattinam"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
                            <div className="relative">
                                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <select
                                    value={preferredLanguage}
                                    onChange={(e) => setPreferredLanguage(e.target.value)}
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                                >
                                    <option value="Tamil">Tamil (தமிழ்)</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi (हिंदी)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Chat ID (Optional for SOS Alerts)</label>
                            <input
                                type="text"
                                value={telegramChatId}
                                onChange={(e) => setTelegramChatId(e.target.value)}
                                placeholder="e.g. 123456789"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Person</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={emergencyContactName}
                                onChange={(e) => setEmergencyContactName(e.target.value)}
                                placeholder="Contact Name (e.g. Murugan Sundaram)"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                            />
                            <input
                                type="tel"
                                value={emergencyContactPhone}
                                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                placeholder="Emergency Phone Number"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Registering Patient...' : 'Complete Patient Registration'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Already registered?{' '}
                    <Link to="/patient/login" className="text-brand-400 hover:underline font-semibold">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};
