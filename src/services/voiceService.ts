// Voice Assistant Service using Browser Web Speech API with fallback handling

export interface VoiceRecognitionState {
    isSupported: boolean;
    isListening: boolean;
    transcript: string;
    error?: string;
}

export type VoiceErrorCode =
    | 'unsupported'
    | 'permission-denied'
    | 'no-microphone'
    | 'microphone-unavailable'
    | 'network'
    | 'aborted'
    | 'unknown';

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

export async function requestMicrophonePermission(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('microphone-unavailable');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
}

export function describeVoiceError(error: string): string {
    switch (error) {
        case 'permission-denied':
            return 'Microphone permission was denied. Allow microphone access for localhost, then try again. Text chat still works.';
        case 'no-microphone':
            return 'No microphone was detected. Connect a microphone and try again.';
        case 'microphone-unavailable':
            return 'The microphone is unavailable or already in use. Close other recording apps and try again.';
        case 'network':
            return 'The browser speech service could not connect. Check your connection and try again.';
        case 'unsupported':
            return 'Voice input is not supported in this browser. You can continue using text.';
        case 'aborted':
            return 'Voice input was stopped.';
        default:
            return 'Microphone input could not start. You can continue using text chat.';
    }
}

export async function startSpeechRecognition(
    language: 'en' | 'ta' = 'en',
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
): Promise<any | null> {
    if (!isSpeechRecognitionSupported()) {
        onError('unsupported');
        return null;
    }

    try {
        await requestMicrophonePermission();
        const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechClass();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results as ArrayLike<{ 0: { transcript: string } }>)
                .map((result) => result[0].transcript)
                .join(' ')
                .trim();
            if (transcript) onResult(transcript);
        };

        recognition.onerror = (event: any) => {
            const errorCode = event.error === 'not-allowed'
                ? 'permission-denied'
                : event.error === 'no-speech'
                    ? 'aborted'
                    : event.error === 'audio-capture'
                        ? 'no-microphone'
                        : event.error === 'network'
                            ? 'network'
                            : event.error === 'aborted'
                                ? 'aborted'
                                : 'unknown';
            onError(errorCode);
        };

        recognition.onend = () => {
            onEnd();
        };

        recognition.start();
        return recognition;
    } catch (err: any) {
        const errorCode = err?.message === 'permission-denied' || err?.name === 'NotAllowedError'
            ? 'permission-denied'
            : err?.name === 'NotFoundError'
                ? 'no-microphone'
                : err?.message === 'microphone-unavailable'
                    ? 'microphone-unavailable'
                    : 'unknown';
        onError(errorCode);
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
