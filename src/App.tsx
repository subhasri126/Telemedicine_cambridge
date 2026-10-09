import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { CareJourneyProvider } from './context/CareJourneyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CareBridgeAssistantModal } from './components/ai/CareBridgeAssistantModal';
import { EmergencySOSModal } from './components/emergency/EmergencySOSModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { PatientLoginPage } from './pages/auth/PatientLoginPage';
import { PatientRegisterPage } from './pages/auth/PatientRegisterPage';
import { DoctorLoginPage } from './pages/auth/DoctorLoginPage';
import { DoctorRegisterPage } from './pages/auth/DoctorRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

import { PatientDashboard } from './pages/patient/PatientDashboard';
import { HealthCheckPage } from './pages/patient/HealthCheckPage';
import { DoctorSearchPage } from './pages/patient/DoctorSearchPage';
import { PrescriptionsPage } from './pages/patient/PrescriptionsPage';
import { PharmacyPage } from './pages/patient/PharmacyPage';

import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientDetailPage } from './pages/doctor/PatientDetailPage';
import { CreatePrescriptionPage } from './pages/doctor/CreatePrescriptionPage';
import { HospitalHandoffPage } from './pages/doctor/HospitalHandoffPage';

import { ConsultationRoomPage } from './pages/consultation/ConsultationRoomPage';
import { SmsDevelopmentTestPage } from './pages/patient/SmsDevelopmentTestPage';
import { Bot } from 'lucide-react';
import { I18nProvider, useI18n } from './i18n';

export function App() {
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

    return (
        <BrowserRouter>
            <AuthProvider>
                <I18nProvider>
                    <NetworkProvider>
                        <CareJourneyProvider>
                            <AppContent
                                isAIModalOpen={isAIModalOpen}
                                setIsAIModalOpen={setIsAIModalOpen}
                                isSOSModalOpen={isSOSModalOpen}
                                setIsSOSModalOpen={setIsSOSModalOpen}
                            />
                        </CareJourneyProvider>
                    </NetworkProvider>
                </I18nProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

function AppContent({ isAIModalOpen, setIsAIModalOpen, isSOSModalOpen, setIsSOSModalOpen }: {
    isAIModalOpen: boolean;
    setIsAIModalOpen: (open: boolean) => void;
    isSOSModalOpen: boolean;
    setIsSOSModalOpen: (open: boolean) => void;
}) {
    const { language, setLanguage } = useI18n();
    return (
                        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-brand-500 selection:text-white">

                            {/* Navigation Bar */}
                            <Navbar
                                language={language}
                                setLanguage={setLanguage}
                                onOpenSOSModal={() => setIsSOSModalOpen(true)}
                                onOpenAIModal={() => setIsAIModalOpen(true)}
                            />

                            {/* Main Content Router */}
                            <main className="flex-1">
                                <Routes>
                                    {/* Public & Authentication Routes */}
                                    <Route
                                        path="/"
                                        element={
                                            <LandingPage
                                                onOpenAIModal={() => setIsAIModalOpen(true)}
                                                onOpenSOSModal={() => setIsSOSModalOpen(true)}
                                            />
                                        }
                                    />
                                    <Route path="/login" element={<RoleSelectionPage mode="login" />} />
                                    <Route path="/register" element={<RoleSelectionPage mode="register" />} />
                                    <Route path="/patient/login" element={<PatientLoginPage />} />
                                    <Route path="/patient/register" element={<PatientRegisterPage />} />
                                    <Route path="/doctor/login" element={<DoctorLoginPage />} />
                                    <Route path="/doctor/register" element={<DoctorRegisterPage />} />
                                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                                    {/* Patient Protected Routes */}
                                    <Route
                                        path="/patient/dashboard"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <PatientDashboard
                                                    onOpenAIModal={() => setIsAIModalOpen(true)}
                                                    onOpenSOSModal={() => setIsSOSModalOpen(true)}
                                                    language={language}
                                                />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/patient/health-check"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <HealthCheckPage onOpenSOSModal={() => setIsSOSModalOpen(true)} />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/patient/doctors"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <DoctorSearchPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/patient/prescriptions"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <PrescriptionsPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/patient/pharmacy"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <PharmacyPage />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Doctor Protected Routes */}
                                    <Route
                                        path="/doctor/dashboard"
                                        element={
                                            <ProtectedRoute allowedRole="doctor">
                                                <DoctorDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/doctor/patient/:patientId"
                                        element={
                                            <ProtectedRoute allowedRole="doctor">
                                                <PatientDetailPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/doctor/create-prescription"
                                        element={
                                            <ProtectedRoute allowedRole="doctor">
                                                <CreatePrescriptionPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/doctor/hospital-handoff"
                                        element={
                                            <ProtectedRoute allowedRole="doctor">
                                                <HospitalHandoffPage />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Consultation Room */}
                                    <Route path="/consultation/:consultationId" element={<ConsultationRoomPage />} />
                                    <Route path="/consultation" element={<ConsultationRoomPage />} />
                                    <Route
                                        path="/sms-test"
                                        element={
                                            <ProtectedRoute allowedRole="patient">
                                                <SmsDevelopmentTestPage />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Fallback Catch-all */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </main>

                            {/* Footer */}
                            <Footer />

                            {/* Floating Action Button for CareBridge AI Voice & Text Assistant */}
                            <button
                                onClick={() => setIsAIModalOpen(true)}
                                className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white shadow-medical-lg hover:scale-110 active:scale-95 transition-all group border border-white/20"
                                title="Open CareBridge Voice & Text Assistant"
                            >
                                <div className="relative">
                                    <Bot className="w-7 h-7" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
                                </div>
                            </button>

                            {/* Global Modals */}
                            <CareBridgeAssistantModal
                                isOpen={isAIModalOpen}
                                onClose={() => setIsAIModalOpen(false)}
                                language={language}
                                setLanguage={setLanguage}
                                onOpenSOSModal={() => {
                                    setIsAIModalOpen(false);
                                    setIsSOSModalOpen(true);
                                }}
                            />

                            <EmergencySOSModal
                                isOpen={isSOSModalOpen}
                                onClose={() => setIsSOSModalOpen(false)}
                            />

                        </div>
    );
}

export default App;
