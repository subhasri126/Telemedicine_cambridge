import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CareBridgeLogo } from '../../components/branding/CareBridgeLogo';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-medical-lg border border-slate-200 w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <CareBridgeLogo size="md" className="justify-center" />
                    <h2 className="text-xl font-bold text-slate-900 pt-2">Reset Password</h2>
                    <p className="text-xs text-slate-500">Enter your email to receive recovery instructions</p>
                </div>

                {sent ? (
                    <div className="text-center py-4 space-y-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <p className="text-xs font-bold text-slate-800">Password reset link sent to {email}</p>
                        <p className="text-[11px] text-slate-500">Check your inbox to recover your access password.</p>
                        <Link to="/login" className="inline-block text-xs font-bold text-brand-600 hover:underline pt-2">
                            Return to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@domain.org"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-medical transition-all"
                        >
                            Send Reset Link
                        </button>
                    </form>
                )}

                <div className="text-center">
                    <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};
