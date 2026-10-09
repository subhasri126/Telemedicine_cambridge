const API_BASE_URL = 'http://localhost:5000/api';

export function getAuthToken(): string | null {
    return localStorage.getItem('cbr_token');
}

export function setAuthToken(token: string) {
    localStorage.setItem('cbr_token', token);
}

export function removeAuthToken() {
    localStorage.removeItem('cbr_token');
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {})
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorMessage = 'API Request Failed';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) { }
        throw new Error(errorMessage);
    }

    return response.json();
}
