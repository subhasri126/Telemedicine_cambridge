import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, HeartPulse, LogOut, Menu, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead } from '../../services/notificationService';
import { AppNotification } from '../../types';
import { Language, useI18n } from '../../i18n';

interface NavbarProps {
    onOpenSOSModal: () => void;
    onOpenAIModal: () => void;
    language?: Language;
    setLanguage?: (lang: Language) => void;
}

const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'How It Works', href: '/#how-it-works' }
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenSOSModal }) => {
    const { language, setLanguage, t } = useI18n();
    const { user, role, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        if (role) {
            setNotifications(getNotifications(role, user?.id));
        } else {
            setNotifications([]);
        }
    }, [role, user?.id]);

    const closeMenu = () => setMobileMenuOpen(false);
    const isHome = location.pathname === '/';
    const isPublicRoute = ['/', '/login', '/register', '/patient/login', '/patient/register', '/doctor/login', '/doctor/register', '/forgot-password'].includes(location.pathname);
    const showPortalNavigation = Boolean(role && !isPublicRoute);
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const handlePublicLink = (href: string) => {
        closeMenu();
        if (href === '/' && isHome) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(href);
        }
    };

    const handleNotificationRead = (id: string) => {
        markNotificationRead(id);
        setNotifications((current) => current.map((notification) => (
            notification.id === id ? { ...notification, read: true } : notification
        )));
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to={showPortalNavigation && role === 'doctor' ? '/doctor/dashboard' : showPortalNavigation && role === 'patient' ? '/patient/dashboard' : '/'}
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    aria-label="CareBridge Rural home"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <HeartPulse className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-base font-semibold tracking-tight sm:text-lg">
                        CareBridge <span className="text-brand-700">Rural</span>
                    </span>
                </Link>

                {!showPortalNavigation && (
                    <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                        {publicLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(event) => {
                                    if (link.href === '/' && isHome) {
                                        event.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                            >
                                {link.label === 'Home' ? t('home') : link.label === 'Services' ? t('services') : t('howItWorks')}
                            </a>
                        ))}
                    </nav>
                )}

                {showPortalNavigation && (
                    <nav className="hidden items-center gap-6 md:flex" aria-label="Portal navigation">
                        <Link to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="text-sm font-medium text-slate-600 hover:text-brand-700">
                            {t('dashboard')}
                        </Link>
                        <Link to={role === 'patient' ? '/patient/doctors' : '/doctor/patient/patient-priya-01'} className="text-sm font-medium text-slate-600 hover:text-brand-700">
                            {role === 'patient' ? t('findDoctor') : t('patientRecord')}
                        </Link>
                    </nav>
                )}

                <div className="hidden items-center gap-3 md:flex">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <span className="sr-only">{t('language')}</span>
                        <select
                            value={language}
                            onChange={(event) => setLanguage(event.target.value as Language)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            aria-label={t('language')}
                        >
                            <option value="en">{t('english')}</option>
                            <option value="ta">{t('tamil')}</option>
                        </select>
                    </label>
                    {!showPortalNavigation ? (
                        <>
                            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                                {t('login')}
                            </Link>
                            <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                                {t('getStarted')}
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowNotifications((current) => !current)}
                                    className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    aria-label={`${t('notifications')}${unreadCount ? `, ${unreadCount} unread` : ''}`}
                                    aria-expanded={showNotifications}
                                >
                                    <Bell className="h-5 w-5" aria-hidden="true" />
                                    {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-medical-lg" role="dialog" aria-label="Notifications">
                                        <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-800">{t('notifications')}</div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="px-4 py-6 text-center text-xs text-slate-400">{t('noNotifications')}</p>
                                            ) : notifications.map((notification) => (
                                                <button key={notification.id} type="button" onClick={() => handleNotificationRead(notification.id)} className={`block w-full px-4 py-2.5 text-left hover:bg-slate-50 ${!notification.read ? 'bg-brand-50/50' : ''}`}>
                                                    <p className="text-xs font-bold text-slate-800">{notification.title}</p>
                                                    <p className="mt-0.5 text-[11px] text-slate-600">{notification.message}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={onOpenSOSModal} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-extrabold text-white shadow-emergency hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
                                <ShieldAlert className="h-4 w-4" aria-hidden="true" /> SOS
                            </button>
                            <button type="button" onClick={logout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-brand-500" aria-label={t('logout')}>
                                <LogOut className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 md:hidden"
                    onClick={() => setMobileMenuOpen((current) => !current)}
                    aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div id="mobile-navigation" className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden">
                    <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                        {!showPortalNavigation ? (
                            <>
                                {publicLinks.map((link) => (
                                    <a key={link.label} href={link.href} onClick={() => handlePublicLink(link.href)} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700">{link.label === 'Home' ? t('home') : link.label === 'Services' ? t('services') : t('howItWorks')}</a>
                                ))}
                                <label className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-700">
                                    <span>{t('language')}</span>
                                    <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm">
                                        <option value="en">{t('english')}</option>
                                        <option value="ta">{t('tamil')}</option>
                                    </select>
                                </label>
                                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                                    <Link to="/login" onClick={closeMenu} className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700">{t('login')}</Link>
                                    <Link to="/register" onClick={closeMenu} className="rounded-xl bg-brand-600 px-3 py-3 text-center text-sm font-semibold text-white">{t('getStarted')}</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{t('dashboard')}</Link>
                                <Link to={role === 'patient' ? '/patient/doctors' : '/doctor/patient/patient-priya-01'} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{role === 'patient' ? t('findDoctor') : t('patientRecord')}</Link>
                                <label className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-700">
                                    <span>{t('language')}</span>
                                    <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm">
                                        <option value="en">{t('english')}</option>
                                        <option value="ta">{t('tamil')}</option>
                                    </select>
                                </label>
                                <button type="button" onClick={() => { closeMenu(); onOpenSOSModal(); }} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 py-3 text-sm font-bold text-white"><ShieldAlert className="h-4 w-4" /> SOS</button>
                                <button type="button" onClick={() => { closeMenu(); logout(); }} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" /> {t('logout')}</button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};
