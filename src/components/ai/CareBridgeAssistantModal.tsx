import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    processAIChatMessage,
    ChatMessage
} from '../../services/aiAssistantService';
import {
    startSpeechRecognition,
    speakText,
    isSpeechRecognitionSupported
} from '../../services/voiceService';
import {
    Bot,
    Send,
    Mic,
    MicOff,
    Volume2,
    X,
    Sparkles,
    ShieldAlert,
    Stethoscope,
    FileText,
    Pill,
    Globe,
    Trash2,
    AlertCircle
} from 'lucide-react';

interface CareBridgeAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'ta';
    setLanguage: (lang: 'en' | 'ta') => void;
    onOpenSOSModal: () => void;
}

export const CareBridgeAssistantModal: React.FC<CareBridgeAssistantModalProps> = ({
    isOpen,
    onClose,
    language,
    setLanguage,
    onOpenSOSModal
}) => {
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [inputQuery, setInputQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [activeSpeechRecognition, setActiveSpeechRecognition] = useState<any>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Welcome message
            const welcomeMsg: ChatMessage = {
                id: 'welcome-01',
                sender: 'assistant',
                text: language === 'ta'
                    ? 'வணக்கம்! கேர்பிரிட்ஜ் உதவி மையத்திற்கு வரவேற்கிறோம். நான் உங்கள் உடல்நல வழிகாட்டி. உங்களுக்கு எவ்வாறு உதவ முடியும்?'
                    : 'Hello! Welcome to CareBridge Assistant. I provide AI-assisted guidance for symptom screening, doctor finding, prescription access, and emergency SOS.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([welcomeMsg]);
        }
    }, [isOpen, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    if (!isOpen) return null;

    const handleSendMessage = async (customText?: string) => {
        const textToSend = customText || inputQuery;
        if (!textToSend.trim()) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputQuery('');
        setIsTyping(true);

        // Call AI Assistant Service
        setTimeout(async () => {
            const responseMsg = await processAIChatMessage(textToSend, language);
            setMessages((prev) => [...prev, responseMsg]);
            setIsTyping(false);

            // Read aloud response
            speakText(responseMsg.text, language);
        }, 600);
    };

    const handleStartVoice = () => {
        setVoiceError(null);
        if (!isSpeechRecognitionSupported()) {
            setVoiceError('Voice input is not available in this browser. You can continue using text.');
            return;
        }

        setIsListening(true);
        const recognition = startSpeechRecognition(
            language,
            (transcript) => {
                setIsListening(false);
                setInputQuery(transcript);
                handleSendMessage(transcript);
            },
            (err) => {
                setIsListening(false);
                setVoiceError(err);
            },
            () => {
                setIsListening(false);
            }
        );
        setActiveSpeechRecognition(recognition);
    };

    const handleStopVoice = () => {
        if (activeSpeechRecognition) {
            try {
                activeSpeechRecognition.stop();
            } catch (e) {
                console.error(e);
            }
        }
        setIsListening(false);
    };

    const handleActionButton = (action: string) => {
        onClose();
        if (action === 'start_emergency') {
            onOpenSOSModal();
        } else if (action === 'start_health_check') {
            navigate('/patient/health-check');
        } else if (action === 'find_doctor') {
            navigate('/patient/doctors');
        } else if (action === 'view_prescription') {
            navigate('/patient/prescriptions');
        } else if (action === 'order_medicine') {
            navigate('/patient/pharmacy');
        }
    };

    const suggestedPrompts = language === 'ta' ? [
        'மருத்துவர் வேண்டும்',
        'எனக்கு காய்ச்சல் இருக்கு',
        'எனக்கு மூச்சு விட கஷ்டமா இருக்கு',
        'மருந்து டெலிவரி பெறலாம்'
    ] : [
        'I need a doctor.',
        'I have fever.',
        'I have breathing difficulty.',
        'How can I get my medicine?'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-medical-lg w-full max-w-lg h-[600px] flex flex-col overflow-hidden border border-slate-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-brand-600 to-teal-600 text-white p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base">CareBridge Assistant</h3>
                                <span className="text-[10px] bg-emerald-400/20 text-emerald-100 font-semibold px-2 py-0.5 rounded-full border border-emerald-300/30">
                                    AI Guidance
                                </span>
                            </div>
                            <p className="text-xs text-brand-100">Smart Voice & Symptom Triage</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all border border-white/20"
                            title="Switch Language"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
                        </button>
                        <button
                            onClick={() => setMessages([])}
                            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Safety Disclaimer Banner */}
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>AI-assisted triage guidance only. Does not replace a qualified medical professional.</span>
                </div>

                {/* Voice Listening Active Wave Banner */}
                {isListening && (
                    <div className="bg-brand-50 border-b border-brand-200 px-4 py-3 flex items-center justify-between text-xs text-brand-800 animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-600 animate-ping" />
                            <span className="font-bold">Listening in {language === 'ta' ? 'Tamil' : 'English'}... Speak now</span>
                        </div>
                        <button
                            onClick={handleStopVoice}
                            className="text-xs text-rose-600 font-bold hover:underline"
                        >
                            Stop Microphone
                        </button>
                    </div>
                )}

                {/* Voice Error Notice */}
                {voiceError && (
                    <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 text-xs text-rose-700 flex justify-between items-center">
                        <span>{voiceError}</span>
                        <button onClick={() => setVoiceError(null)} className="font-bold">✕</button>
                    </div>
                )}

                {/* Chat Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-brand-600 text-white rounded-br-none'
                                        : msg.isEmergencyAlert
                                            ? 'bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-bl-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <div className="flex items-center justify-between mt-1.5 text-[10px] opacity-70">
                                    <span>{msg.timestamp}</span>
                                    {msg.sender === 'assistant' && (
                                        <button
                                            onClick={() => speakText(msg.text, language)}
                                            className="hover:opacity-100 flex items-center gap-1"
                                            title="Read Aloud"
                                        >
                                            <Volume2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Optional Action Button inside Message */}
                                {msg.actionButton && (
                                    <button
                                        onClick={() => handleActionButton(msg.actionButton!.action)}
                                        className={`mt-3 w-full py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${msg.isEmergencyAlert
                                                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                                                : 'bg-brand-600 hover:bg-brand-700 text-white'
                                            }`}
                                    >
                                        <span>{msg.actionButton.label}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-xl w-fit">
                            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
                            <span>CareBridge Assistant is thinking...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Quick Prompts */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {suggestedPrompts.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">

                    {/* Microphone Button */}
                    <button
                        onClick={isListening ? handleStopVoice : handleStartVoice}
                        className={`p-2.5 rounded-xl border transition-all ${isListening
                                ? 'bg-rose-600 text-white border-rose-600 animate-bounce'
                                : 'bg-slate-100 hover:bg-brand-50 text-slate-700 border-slate-200 hover:border-brand-300'
                            }`}
                        title="Speak (Voice Assistant)"
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-brand-600" />}
                    </button>

                    <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={language === 'ta' ? 'இங்கே கேட்கவும்...' : 'Type or speak your symptom/request...'}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />

                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputQuery.trim()}
                        className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
};
