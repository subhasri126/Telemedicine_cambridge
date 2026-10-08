// CareBridge AI Assistant Service
// Implements medical safety guidelines: Risk screening & guided navigation without diagnostic claims

export interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    isEmergencyAlert?: boolean;
    actionButton?: {
        label: string;
        action: 'start_emergency' | 'start_health_check' | 'find_doctor' | 'view_prescription' | 'order_medicine';
    };
}

const URGENT_SYMPTOMS = [
    'breathing difficulty', 'difficulty breathing', 'moochu', 'chest pain', 'chest discomfort',
    'severe pain', 'unconscious', 'fainted', 'heavy bleeding', 'stroke', 'paralysis'
];

export async function processAIChatMessage(
    userText: string,
    language: 'en' | 'ta' = 'en'
): Promise<ChatMessage> {
    const lower = userText.toLowerCase();

    // Check for emergency keywords
    const isEmergency = URGENT_SYMPTOMS.some((keyword) => lower.includes(keyword));

    if (isEmergency) {
        if (language === 'ta') {
            return {
                id: `ai-${Date.now()}`,
                sender: 'assistant',
                text: 'மூச்சுத் திணறல் அல்லது நெஞ்சு வலி அவசர மருத்துவ கவனிப்பு தேவைப்படலாம். நான் உடனே உங்களுக்கு அவசர உதவி (Emergency SOS) சேவையைத் தொடங்க முடியும்.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isEmergencyAlert: true,
                actionButton: {
                    label: '🚨 அவசர உதவி தேவை (Start Emergency Care)',
                    action: 'start_emergency'
                }
            };
        }
        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: 'Breathing difficulty or severe symptoms require urgent professional medical attention. I can immediately activate an Emergency SOS care request for you and alert the nearest doctor.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEmergencyAlert: true,
            actionButton: {
                label: '🚨 Start Emergency Care',
                action: 'start_emergency'
            }
        };
    }

    // Doctor match intent
    if (lower.includes('doctor') || lower.includes('doctor venum') || lower.includes('consult')) {
        if (language === 'ta') {
            return {
                id: `ai-${Date.now()}`,
                sender: 'assistant',
                text: 'கிராமப்புற மருத்துவ சேவைக்காக சிறந்த மருத்துவர்கள் தயாராக உள்ளனர். உங்கள் நோய்க்கான மருத்துவரைப் பார்க்கவும்.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actionButton: {
                    label: 'மருத்துவரைத் தேடுங்கள் (Find Doctor)',
                    action: 'find_doctor'
                }
            };
        }
        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: 'Our specialized rural healthcare doctors are available for consultation. Would you like me to match you with an available specialist right now?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionButton: {
                label: 'Find a Doctor',
                action: 'find_doctor'
            }
        };
    }

    // Symptom check intent
    if (lower.includes('fever') || lower.includes('cough') || lower.includes('irukku') || lower.includes('pain') || lower.includes('headache')) {
        if (language === 'ta') {
            return {
                id: `ai-${Date.now()}`,
                sender: 'assistant',
                text: 'உங்கள் அறிகுறிகளை அடிப்படையாகக் கொண்டு ஆபத்து அளவை (AI Risk Screening) கணக்கிடலாம். தயவுசெய்து உங்கள் வெப்பநிலை மற்றும் ஆக்சிஜன் (SpO2) விபரங்களை வழங்கவும்.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actionButton: {
                    label: 'உடல்நலப் பரிசோதனை (Start Health Check)',
                    action: 'start_health_check'
                }
            };
        }
        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: 'I can help you perform an AI-assisted health screening to check your vital status and recommend the proper next step.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionButton: {
                label: 'Start Health Assessment',
                action: 'start_health_check'
            }
        };
    }

    // Prescription / Medicine intent
    if (lower.includes('prescription') || lower.includes('medicine') || lower.includes('pharmacy') || lower.includes('marundhu')) {
        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: language === 'ta'
                ? 'உங்கள் மருத்துவக் குறிப்புகள் மற்றும் மருந்துகளை உங்கள் கதவுக்கே டெலிவரி செய்யக் கோரலாம்.'
                : 'You can view your active prescriptions or request doorstep delivery for your prescribed medicines.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionButton: {
                label: language === 'ta' ? 'மருந்து டெலிவரி (Order Medicine)' : 'Order Medicine',
                action: 'order_medicine'
            }
        };
    }

    // Low connectivity / general guidance
    return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: language === 'ta'
            ? 'வணக்கம்! கேர்பிரிட்ஜ் உதவி மையம் உங்களுக்கு எவ்வாறு உதவ முடியும்? மருத்துவர் ஆலோசனை, அவசர உதவி அல்லது மருந்து டெலிவரி பெறலாம்.'
            : 'Hello! CareBridge Assistant is here to guide you. I can assist with symptom screening, finding doctors, emergency SOS, or tracking medicine delivery. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}
