import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CareBridgeLogo } from '../branding/CareBridgeLogo';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { getNotifications, markNotificationRead } from '../../services/notificationService';
import { BandwidthMode, AppNotification } from '../../types';
import {
    Bell,
    ShieldAlert,
    Wifi,
    User,
    LogOut,
    Globe,
    Stethoscope,
    Activity,
    Pill,
    FileText,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';

interface NavbarProps {
    onOpenSOSModal: () => void;
    onOpenAIModal: () => void;
    language: 'en' | 'ta';
    setLanguage: (lang: 'en' | 'ta') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    onOpenSOSModal,
    onOpenAIModal,
    language,
    setLanguage
}) => {
    const { user, role, logout, loginAsDemoPatient, loginAsDemoDoctor } = useAuth();
    const { bandwidthMode, setBandwidthMode } = useNetwork();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (role) {
            const list = getNotifications(role, user?.id);
            setNotifications(list);
        }
    }, [role, user?.id]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkRead = (id: string) => {
        markNotificationRead(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const bandwidthColors: Record<BandwidthMode, string> = {
        Excellent: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        Good: 'bg-sky-100 text-sky-800 border-sky-300',
        Fair: 'bg-amber-100 text-amber-800 border-amber-300',
        Poor: 'bg-orange-100 text-orange-800 border-orange-300',
        Offline: 'bg-rose-100 text-rose-800 border-rose-300',
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    {/* Logo */}
                    <Link to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="flex items-center">
                        <CareBridgeLogo size="md" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {role === 'patient' && (
                            <>
                                <Link
                                    to="/patient/dashboard"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/patient/dashboard'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {language === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard'}
                                </Link>
                                <Link
                                    to="/patient/health-check"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/patient/health-check'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {language === 'ta' ? 'சுகாதார சோதனை' : 'Health Assessment'}
                                </Link>
                                <Link
                                    to="/patient/doctors"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/patient/doctors'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {language === 'ta' ? 'மருத்துவர்கள்' : 'Find Doctor'}
                                </Link>
                                <Link
                                    to="/patient/prescriptions"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/patient/prescriptions'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {language === 'ta' ? 'மருத்துவக் சீட்டு' : 'Prescriptions'}
                                </Link>
                                <Link
                                    to="/patient/pharmacy"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/patient/pharmacy'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {language === 'ta' ? 'மருந்து விநியோகம்' : 'Medicine Order'}
                                </Link>
                            </>
                        )}

                        {role === 'doctor' && (
                            <>
                                <Link
                                    to="/doctor/dashboard"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/doctor/dashboard'
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Doctor Dashboard
                                </Link>
                                <Link
                                    to="/doctor/patient/patient-priya-01"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.includes('/doctor/patient')
                                            ? 'bg-brand-50 text-brand-700 font-semibold'
                                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Active Patient Record
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right Action Bar */}
                    <div className="flex items-center space-x-2 sm:space-x-3">

                        {/* Network Mode Switcher Dropdown (Judge Demo Widget) */}
                        <div className="relative">
                            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bandwidthColors[bandwidthMode]}`}>
                                <Wifi className="w-3.5 h-3.5" />
                                <span>Net: {bandwidthMode}</span>
                                <select
                                    value={bandwidthMode}
                                    onChange={(e) => setBandwidthMode(e.target.value as BandwidthMode)}
                                    className="bg-transparent opacity-0 absolute inset-0 cursor-pointer text-xs"
                                    title="Demo Bandwidth Selector"
                                >
                                    <option value="Excellent">Excellent (4G/Fiber)</option>
                                    <option value="Good">Good (3G/Broadband)</option>
                                    <option value="Fair">Fair (2G/Rural 3G)</option>
                                    <option value="Poor">Poor (Weak Edge)</option>
                                    <option value="Offline">Offline Simulation</option>
                                </select>
                            </div>
                        </div>

                        {/* Language Switcher Button */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-all border border-slate-200"
                            title="Toggle Language"
                        >
                            <Globe className="w-3.5 h-3.5 text-brand-600" />
                            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                        </button>

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-medical-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                                        <span className="text-xs text-slate-500 font-medium">{notifications.length} alerts</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-xs text-slate-400">No new notifications</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleMarkRead(n.id)}
                                                    className={`px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-brand-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'emergency' ? 'bg-rose-500' : 'bg-brand-500'
                                                            }`} />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                                            <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{n.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Role Toggle Switcher for Judges */}
                        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                            <button
                                onClick={loginAsDemoPatient}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${role === 'patient'
                                        ? 'bg-white text-brand-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Patient (Priya)
                            </button>
                            <button
                                onClick={loginAsDemoDoctor}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${role === 'doctor'
                                        ? 'bg-white text-teal-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Doctor (Dr. Arun)
                            </button>
                        </div>

                        {/* Emergency SOS Button */}
                        <button
                            onClick={onOpenSOSModal}
                            className="bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-emergency transition-all hover:scale-105 active:scale-95 animate-pulse"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span>SOS</span>
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500">Switch Demo Role:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { loginAsDemoPatient(); setMobileMenuOpen(false); }}
                                className="px-2 py-1 text-xs rounded bg-brand-50 text-brand-700 font-bold"
                            >
                                Patient
                            </button>
                            <button
                                onClick={() => { loginAsDemoDoctor(); setMobileMenuOpen(false); }}
                                className="px-2 py-1 text-xs rounded bg-teal-50 text-teal-700 font-bold"
                            >
                                Doctor
                            </button>
                        </div>
                    </div>

                    <Link
                        to="/patient/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/patient/health-check"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                        Health Assessment
                    </Link>
                    <Link
                        to="/patient/doctors"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                        Find Doctor
                    </Link>
                    <Link
                        to="/patient/prescriptions"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                        Prescriptions
                    </Link>
                    <Link
                        to="/patient/pharmacy"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                        Medicine Delivery
                    </Link>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Logged in as {user?.fullName} ({role})</span>
                        <button onClick={logout} className="text-rose-600 font-bold flex items-center gap-1">
                            <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
