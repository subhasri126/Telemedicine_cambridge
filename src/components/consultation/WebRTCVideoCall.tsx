import React, { useState, useEffect, useRef } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { BandwidthMode } from '../../types';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Wifi,
    AlertTriangle,
    MessageSquare,
    Send,
    ShieldCheck,
    User,
    Clock
} from 'lucide-react';

interface WebRTCVideoCallProps {
    doctorName: string;
    doctorSpecialty: string;
    patientName: string;
    onEndCall: () => void;
}

export const WebRTCVideoCall: React.FC<WebRTCVideoCallProps> = ({
    doctorName,
    doctorSpecialty,
    patientName,
    onEndCall
}) => {
    const { bandwidthMode, setBandwidthMode } = useNetwork();

    const [isAudioOnly, setIsAudioOnly] = useState<boolean>(bandwidthMode === 'Fair' || bandwidthMode === 'Poor');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(!isAudioOnly);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
        { sender: doctorName, text: 'Hello Priya, I can see your vitals. How are you feeling right now?', time: '10:30 AM' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [secondsElapsed, setSecondsElapsed] = useState(145);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Timer counter
    useEffect(() => {
        const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Handle local camera access if available
    useEffect(() => {
        let stream: MediaStream | null = null;
        async function initCamera() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && isVideoOn) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch (e) {
                    console.warn('Camera access denied or unavailable, showing realistic medical video loop', e);
                }
            }
        }
        initCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isVideoOn]);

    const formatTimer = (totalSec: number) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendChatMessage = () => {
        if (!chatInput.trim()) return;
        setChatMessages((prev) => [
            ...prev,
            { sender: patientName, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setChatInput('');
    };

    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-medical-lg flex flex-col h-[650px] relative">

            {/* Top Overlay Bar */}
            <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm">
                        Dr
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{doctorName}</h3>
                        <p className="text-xs text-slate-300">{doctorSpecialty}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Active Call Timer */}
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimer(secondsElapsed)}</span>
                    </div>

                    {/* Network Indicator */}
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-sky-300 border border-sky-500/30">
                        <Wifi className="w-3.5 h-3.5" />
                        <span>{bandwidthMode} Mode</span>
                    </div>
                </div>
            </div>

            {/* Weak Network Low-Bandwidth Alert Banner */}
            {(bandwidthMode === 'Fair' || bandwidthMode === 'Poor') && !isAudioOnly && (
                <div className="absolute top-16 inset-x-4 z-30 bg-amber-500/95 text-slate-950 px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-lg text-xs font-bold animate-pulse">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-950" />
                        <span>Your connection is weak. Switch to audio consultation for seamless call quality?</span>
                    </div>
                    <button
                        onClick={() => {
                            setIsAudioOnly(true);
                            setIsVideoOn(false);
                        }}
                        className="px-3 py-1 bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Switch to Audio
                    </button>
                </div>
            )}

            {/* Main Stream Area */}
            <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">

                {isAudioOnly ? (
                    /* Audio-only Mode Visualizer */
                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-medical border-4 border-slate-800 animate-pulse">
                                {doctorName.charAt(0)}
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-teal-400/40 animate-ping" />
                        </div>
                        <div className="text-center space-y-1">
                            <h4 className="text-white font-bold text-lg">{doctorName}</h4>
                            <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Audio Call Connected (Low Bandwidth Mode)</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Video Stream View */
                    <div className="w-full h-full relative flex items-center justify-center">
                        {/* Simulated Remote Doctor Video Stream / Canvas fallback */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            poster="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                        {/* Doctor Live Overlay Label */}
                        <div className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{doctorName} (Doctor Feed)</span>
                        </div>

                        {/* Small PiP Local Patient Camera Preview */}
                        <div className="absolute bottom-20 right-4 w-32 h-44 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-2xl">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-bold">
                                You ({patientName})
                            </div>
                        </div>
                    </div>
                )}

                {/* Side Chat Drawer Overlay */}
                {showChat && (
                    <div className="absolute inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 p-4 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3 text-white">
                            <span className="font-bold text-sm">Consultation Chat</span>
                            <button onClick={() => setShowChat(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`p-2.5 rounded-xl ${msg.sender === patientName ? 'bg-brand-600 text-white ml-6' : 'bg-slate-800 text-slate-200 mr-6'}`}>
                                    <p className="font-bold text-[10px] opacity-80">{msg.sender}</p>
                                    <p className="mt-1">{msg.text}</p>
                                    <p className="text-[9px] opacity-60 text-right mt-1">{msg.time}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                placeholder="Type in-call message..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                            <button onClick={handleSendChatMessage} className="p-2 bg-brand-600 text-white rounded-xl">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Controls Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-white">

                <div className="flex items-center gap-2">
                    {/* Audio/Video Mode Switch Button */}
                    <button
                        onClick={() => {
                            const nextAudioState = !isAudioOnly;
                            setIsAudioOnly(nextAudioState);
                            setIsVideoOn(!nextAudioState);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${isAudioOnly
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-200 border-slate-700'
                            }`}
                    >
                        {isAudioOnly ? 'Switch to Video Mode' : 'Switch to Audio Mode'}
                    </button>
                </div>

                {/* Center Media Actions */}
                <div className="flex items-center gap-3">

                    {/* Mic Toggle */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3.5 rounded-2xl border transition-all ${isMuted
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                            }`}
                        title="Toggle Mic"
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Video Toggle */}
                    <button
                        onClick={() => {
                            if (isAudioOnly) {
                                setIsAudioOnly(false);
                                setIsVideoOn(true);
                            } else {
                                setIsVideoOn(!isVideoOn);
                            }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all ${!isVideoOn
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                            }`}
                        title="Toggle Video Camera"
                    >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={onEndCall}
                        className="p-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-emergency transition-all flex items-center gap-2"
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span className="hidden sm:inline">End Call</span>
                    </button>

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 relative"
                        title="In-call Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

            </div>

        </div>
    );
};
