import React from 'react';
import { CareBridgeLogo } from '../branding/CareBridgeLogo';
import { Heart } from 'lucide-react';
import { useI18n } from '../../i18n';

export const Footer: React.FC = () => {
    const { t } = useI18n();
    return (
        <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Column 1: Branding & Mission */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white p-2 rounded-xl inline-block">
                            <CareBridgeLogo size="sm" />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {t('footerMission')}
                        </p>
                        <p className="text-xs text-slate-500">{t('footerSecure')}</p>
                    </div>

                    {/* Column 2: Emergency & Telemedicine Services */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{t('careServices')}</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><a href="/#services" className="hover:text-brand-400 transition-colors">{t('ourServices')}</a></li>
                            <li><a href="/#how-it-works" className="hover:text-brand-400 transition-colors">{t('howItWorks')}</a></li>
                            <li><a href="/login" className="hover:text-brand-400 transition-colors">{t('login')}</a></li>
                            <li><a href="/register" className="hover:text-brand-400 transition-colors">{t('register')}</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Emergency Helpline */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{t('emergencyHelp')}</h4>
                        <p className="text-xs leading-relaxed text-slate-400">{t('footerEmergency')}</p>
                    </div>

                    {/* Column 4: Ethical & Safety Notice */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{t('medicalDisclaimer')}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                            {t('footerMedical')}
                        </p>
                    </div>

                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} CareBridge Rural. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-2 sm:mt-0">
                        <span>{t('madeWith')}</span>
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>for rural health equity</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
