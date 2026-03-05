const API_BASE = '/api';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

    if (res.status === 401) {
        // Try refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('token', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    headers['Authorization'] = `Bearer ${data.accessToken}`;
                    const retryRes = await fetch(`${API_BASE}${url}`, { ...options, headers });
                    if (!retryRes.ok) throw new Error('Request failed after refresh');
                    return retryRes.json();
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
    }
    return res.json();
}

export const api = {
    // Auth
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request<any>('/auth/me'),
    updateProfile: (data: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    submitKyc: (data: { pan_number: string; aadhaar_number: string }) => request<any>('/auth/kyc', { method: 'POST', body: JSON.stringify(data) }),

    // Startups
    getStartups: (params?: Record<string, string>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<any[]>(`/startups${qs}`);
    },
    getStartup: (id: number) => request<any>(`/startups/${id}`),
    createStartup: (data: any) => request<any>('/startups', { method: 'POST', body: JSON.stringify(data) }),
    getFounderStartups: () => request<any[]>('/startups/founder/mine'),
    toggleWatchlist: (id: number) => request<any>(`/startups/${id}/watchlist`, { method: 'POST' }),
    getWatchlist: () => request<any[]>('/startups/user/watchlist'),

    // Investments
    invest: (data: { startup_id: number; amount: number; payment_method?: string }) =>
        request<any>('/investments', { method: 'POST', body: JSON.stringify(data) }),
    getPortfolio: () => request<any>('/investments/portfolio'),
    getPortfolioChart: () => request<any[]>('/investments/portfolio/chart'),

    // Admin
    getAdminStats: () => request<any>('/admin/stats'),
    getAdminStartups: (status?: string) => request<any[]>(`/admin/startups${status ? '?status=' + status : ''}`),
    updateStartupStatus: (id: number, data: any) => request<any>(`/admin/startups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAdminInvestors: () => request<any[]>('/admin/investors'),
    updateKycStatus: (userId: number, status: string) => request<any>(`/admin/kyc/${userId}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getAdminTransactions: (params?: Record<string, string>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<any[]>(`/admin/transactions${qs}`);
    },
    getNotifications: () => request<any>('/admin/notifications'),
    markNotificationRead: (id: number) => request<any>(`/admin/notifications/${id}/read`, { method: 'PUT' }),
    markAllNotificationsRead: () => request<any>('/admin/notifications/read-all', { method: 'PUT' }),
    getBlogPosts: () => request<any[]>('/admin/blog'),
};
