import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Mail, Lock, User, Phone, Award, Building, FileText, Upload, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n';

export const DoctorRegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { registerDoctor } = useAuth();
    const { t } = useI18n();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('General Medicine');
    const [qualification, setQualification] = useState('MBBS, MD');
    const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState('');
    const [experienceYears, setExperienceYears] = useState('8');
    const [languages, setLanguages] = useState('English, Tamil');
    const [hospitalClinic, setHospitalClinic] = useState('');
    const [address, setAddress] = useState('');

    const [regCert, setRegCert] = useState<File | null>(null);
    const [qualCert, setQualCert] = useState<File | null>(null);
    const [idProof, setIdProof] = useState<File | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                setError(`File ${file.name} exceeds maximum allowed size (10MB).`);
                return;
            }
            setter(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('specialty', specialty);
            formData.append('qualification', qualification);
            formData.append('medicalRegistrationNumber', medicalRegistrationNumber);
            formData.append('experienceYears', experienceYears);
            formData.append('languages', languages);
            formData.append('hospitalClinic', hospitalClinic);
            formData.append('address', address);

            if (regCert) formData.append('registrationCertificate', regCert);
            if (qualCert) formData.append('qualificationCertificate', qualCert);
            if (idProof) formData.append('identityProof', idProof);

            await registerDoctor(formData);
            navigate('/doctor/dashboard');
        } catch (err: any) {
            setError(err.message || t('registrationFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl w-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 relative">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('backRole')}</span>
                </Link>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t('doctorRegistration')}</h1>
                    <p className="text-xs text-slate-400 mt-1">{t('doctorVerificationIntro')}</p>
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
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (with Dr. Title) *</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Dr. Rajesh Kannan"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                                    placeholder="dr.rajesh@carebridge.org"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                                    placeholder="+91 98765 43210"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Medical Specialty *</label>
                            <select
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                            >
                                <option value="General Medicine">General Medicine</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Emergency Medicine">Emergency Medicine</option>
                                <option value="Pulmonology">Pulmonology</option>
                                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Qualifications *</label>
                            <div className="relative">
                                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={qualification}
                                    onChange={(e) => setQualification(e.target.value)}
                                    placeholder="e.g. MBBS, MD (Internal Medicine)"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Medical Council Reg. Number *</label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={medicalRegistrationNumber}
                                    onChange={(e) => setMedicalRegistrationNumber(e.target.value)}
                                    placeholder="e.g. TNMC-REG-98124"
                                    required
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Clinical Experience</label>
                            <input
                                type="number"
                                value={experienceYears}
                                onChange={(e) => setExperienceYears(e.target.value)}
                                placeholder="8"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Hospital / Clinic Name</label>
                            <div className="relative">
                                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={hospitalClinic}
                                    onChange={(e) => setHospitalClinic(e.target.value)}
                                    placeholder="Mayiladuthurai District HQ Hospital"
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Languages Spoken</label>
                            <input
                                type="text"
                                value={languages}
                                onChange={(e) => setLanguages(e.target.value)}
                                placeholder="English, Tamil"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="pt-4 border-t border-slate-700/80">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-cyan-400" />
                            <span>Upload Mandatory Verification Documents (PDF / JPG / PNG, Max 10MB)</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                                <label className="block text-[11px] font-medium text-slate-300 mb-1">1. Reg. Certificate *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, setRegCert)}
                                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                                />
                                {regCert && <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {regCert.name}</p>}
                            </div>

                            <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                                <label className="block text-[11px] font-medium text-slate-300 mb-1">2. Qual. Certificate *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, setQualCert)}
                                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                                />
                                {qualCert && <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {qualCert.name}</p>}
                            </div>

                            <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                                <label className="block text-[11px] font-medium text-slate-300 mb-1">3. Identity Proof *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, setIdProof)}
                                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                                />
                                {idProof && <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {idProof.name}</p>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting Credentials...' : 'Submit Doctor Registration'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Already registered doctor?{' '}
                    <Link to="/doctor/login" className="text-cyan-400 hover:underline font-semibold">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};
