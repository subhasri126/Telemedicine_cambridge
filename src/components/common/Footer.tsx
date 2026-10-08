import React from 'react';
import { CareBridgeLogo } from '../branding/CareBridgeLogo';
import { ShieldCheck, Heart, Phone, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
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
                            Empowering rural communities with connected healthcare journeys—from AI risk screening to consultation, hospital handoff, and doorstep medicine delivery.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
                            <ShieldCheck className="w-4 h-4" />
                            <span>HIPAA Compliant & Encrypted</span>
                        </div>
                    </div>

                    {/* Column 2: Emergency & Telemedicine Services */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Care Services</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><a href="#/patient/health-check" className="hover:text-brand-400 transition-colors">AI Symptom Screening</a></li>
                            <li><a href="#/patient/doctors" className="hover:text-brand-400 transition-colors">Specialist Doctor Consultation</a></li>
                            <li><a href="#/patient/prescriptions" className="hover:text-brand-400 transition-colors">Digital Prescription Download</a></li>
                            <li><a href="#/patient/pharmacy" className="hover:text-brand-400 transition-colors">Doorstep Medicine Courier</a></li>
                            <li><a href="#/consultation/consult-01" className="hover:text-brand-400 transition-colors">Low-Bandwidth Video Call</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Emergency Helpline */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Emergency Support</h4>
                        <div className="space-y-2.5 text-xs text-slate-400">
                            <div className="flex items-center gap-2 text-rose-400 font-bold">
                                <Phone className="w-4 h-4" />
                                <span>24/7 SOS Helpline: 108 / +91 4366 220100</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                                <span>District Care Command Centre, Thanjavur Rural Wing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span>emergency@carebridgerural.org</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Ethical & Safety Notice */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Medical Disclaimer</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                            CareBridge Rural is an AI-assisted health screening and telemedicine platform designed to connect rural patients with qualified doctors. AI features perform risk triage guidance and do not replace licensed medical diagnosis.
                        </p>
                    </div>

                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                    <p>© 2026 CareBridge Rural. All rights reserved. Built for Healthcare Access Hackathon.</p>
                    <p className="flex items-center gap-1 mt-2 sm:mt-0">
                        <span>Made with</span>
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>for rural health equity</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
