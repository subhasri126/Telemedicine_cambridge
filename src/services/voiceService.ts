// Voice Assistant Service using Browser Web Speech API with fallback handling

export interface VoiceRecognitionState {
    isSupported: boolean;
    isListening: boolean;
    transcript: string;
    error?: string;
}

// Extend Window interface for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startSpeechRecognition(
    language: 'en' | 'ta' = 'en',
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
): any | null {
    if (!isSpeechRecognitionSupported()) {
        onError('Voice input is not available in this browser. You can continue using text.');
        return null;
    }

    try {
        const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechClass();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        recognition.onerror = (event: any) => {
            onError(`Speech recognition error: ${event.error || 'Mic input interrupted'}`);
        };

        recognition.onend = () => {
            onEnd();
        };

        recognition.start();
        return recognition;
    } catch (err: any) {
        onError('Could not initialize microphone input.');
        return null;
    }
}

export function speakText(text: string, language: 'en' | 'ta' = 'en'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
    }

    try {
        window.speechSynthesis.cancel(); // stop previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        utterance.rate = 0.95; // Clear human cadence
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    } catch (err) {
        console.warn('SpeechSynthesis error:', err);
    }
}
