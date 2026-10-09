import { apiRequest } from '../lib/apiClient';

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
    language: 'en' | 'ta' = 'en',
    previousMessages: ChatMessage[] = []
): Promise<ChatMessage> {
    const isEmergency = URGENT_SYMPTOMS.some((keyword) => userText.toLowerCase().includes(keyword));

    try {
        const history = previousMessages
            .slice(-10)
            .map((message) => ({ role: message.sender, content: message.text }));
        const response = await apiRequest<{
            reply: string;
            fallbackUsed?: boolean;
            notice?: string;
        }>('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message: userText.trim(), language, history })
        });
        const actionButton = isEmergency
            ? {
                label: language === 'ta' ? '🚨 அவசர உதவி தேவை (Start Emergency Care)' : '🚨 Start Emergency Care',
                action: 'start_emergency' as const
            }
            : undefined;

        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: response.fallbackUsed && response.notice
                ? `${response.reply}\n\n[${response.notice}]`
                : response.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEmergencyAlert: isEmergency,
            actionButton
        };
    } catch {
        return {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: 'The AI Guide could not reach the backend. Please check your connection and try again. If this is an emergency, contact local emergency services immediately.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isEmergencyAlert: isEmergency
        };
    }
}
