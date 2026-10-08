import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CareBridgeLogo } from '../../components/branding/CareBridgeLogo';
import { Stethoscope, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { login, loginAsDemoPatient, loginAsDemoDoctor } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('priya@ruralhealth.org');
    const [password, setPassword] = useState('password123');
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await login(email, role);
        setLoading(false);
        if (role === 'doctor') {
            navigate('/doctor/dashboard');
        } else {
            navigate('/patient/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-medical-lg border border-slate-200 w-full max-w-md p-8 space-y-6">

                <div className="text-center space-y-2">
                    <CareBridgeLogo size="md" className="justify-center" />
                    <h2 className="text-xl font-bold text-slate-900 pt-2">Welcome Back</h2>
                    <p className="text-xs text-slate-500">Sign in to your CareBridge Rural account</p>
                </div>

                {/* Hackathon Quick Demo Login Selector */}
                <div className="bg-brand-50/80 p-3 rounded-2xl border border-brand-200 text-center space-y-2">
                    <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block">
                        ⚡ Quick Hackathon Demo Logins:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                loginAsDemoPatient();
                                navigate('/patient/dashboard');
                            }}
                            className="py-2 px-3 bg-white hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl border border-brand-200 transition-colors shadow-sm"
                        >
                            Patient (Priya)
                        </button>
                        <button
                            onClick={() => {
                                loginAsDemoDoctor();
                                navigate('/doctor/dashboard');
                            }}
                            className="py-2 px-3 bg-white hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl border border-teal-200 transition-colors shadow-sm"
                        >
                            Doctor (Dr. Arun)
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Role Toggle Switch */}
                    <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => {
                                setRole('patient');
                                setEmail('priya@ruralhealth.org');
                            }}
                            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${role === 'patient' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600'
                                }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Patient Role</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setRole('doctor');
                                setEmail('dr.arun@carebridge.org');
                            }}
                            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${role === 'doctor' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                                }`}
                        >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Doctor Role</span>
                        </button>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <label className="font-bold text-slate-700">Password</label>
                            <Link to="/forgot-password" className="text-brand-600 hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-medical transition-all flex items-center justify-center gap-2"
                    >
                        <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-brand-600 hover:underline">
                        Register here
                    </Link>
                </div>

            </div>
        </div>
    );
};
