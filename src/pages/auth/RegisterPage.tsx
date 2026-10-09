import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CareBridgeLogo } from '../../components/branding/CareBridgeLogo';

export const RegisterPage: React.FC = () => {
    const { registerPatient } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [village, setVillage] = useState('Kollumangudi Village');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (role === 'doctor') {
            navigate('/doctor/register');
            return;
        }

        try {
            await registerPatient({
                fullName,
                email,
                password,
                village,
                district: 'Nagapattinam'
            });
            navigate('/patient/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-medical-lg border border-slate-200 w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <CareBridgeLogo size="md" className="justify-center" />
                    <h2 className="text-xl font-bold text-slate-900 pt-2">Create an Account</h2>
                    <p className="text-xs text-slate-500">Join CareBridge Rural Telemedicine Network</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`flex-1 py-2.5 rounded-xl transition-all ${role === 'patient' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600'
                                }`}
                        >
                            Patient Registration
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/doctor/register')}
                            className={`flex-1 py-2.5 rounded-xl transition-all ${role === 'doctor' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                                }`}
                        >
                            Doctor Portal &amp; Upload
                        </button>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Priya Sundaram"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="email@domain.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Rural Village / Location</label>
                        <input
                            type="text"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Password</label>
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
                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-medical transition-all"
                    >
                        {loading ? 'Creating Account...' : 'Complete Patient Registration'}
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-2">
                    Already registered?{' '}
                    <Link to="/login" className="font-bold text-brand-600 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};
