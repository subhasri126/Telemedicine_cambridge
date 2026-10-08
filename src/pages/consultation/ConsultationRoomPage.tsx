import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareJourney } from '../../context/CareJourneyContext';
import { WebRTCVideoCall } from '../../components/consultation/WebRTCVideoCall';
import { ArrowLeft, FileText, ShieldAlert } from 'lucide-react';

export const ConsultationRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const { role, patientData, doctorData } = useAuth();
    const { updateStage } = useCareJourney();

    const handleEndCall = () => {
        updateStage('doctorConsultation', 'completed');
        updateStage('prescription', 'active');

        if (role === 'doctor') {
            navigate('/doctor/create-prescription');
        } else {
            navigate('/patient/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-4">

                <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                    <button
                        onClick={handleEndCall}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Leave Session</span>
                    </button>

                    <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                        Encrypted WebRTC Tele-Consultation Stream
                    </span>
                </div>

                <WebRTCVideoCall
                    doctorName={doctorData?.fullName || 'Dr. Arun Kumar'}
                    doctorSpecialty={doctorData?.specialty || 'General Medicine'}
                    patientName={patientData?.fullName || 'Priya Sundaram'}
                    onEndCall={handleEndCall}
                />

                {role === 'doctor' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-white">
                        <span className="text-xs text-slate-300 font-semibold">Ready to complete consultation & issue prescription?</span>
                        <button
                            onClick={() => {
                                handleEndCall();
                                navigate('/doctor/create-prescription');
                            }}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Create Digital Rx</span>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
