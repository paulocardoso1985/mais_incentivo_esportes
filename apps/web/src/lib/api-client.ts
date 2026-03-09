const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    }).catch(err => {
        console.error(`[API FETCH ERROR] URL: ${API_URL}${endpoint}`, err);
        throw err;
    });

    if (!response.ok) {
        console.warn(`[API RESPONSE ERROR] ${response.status} ${response.statusText}`, { endpoint });
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}
