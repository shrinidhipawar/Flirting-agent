export const API_BASE_URL = "http://127.0.0.1:8000";

export const endpoints = {
    // User Management
    users: `${API_BASE_URL}/users/`,
    logActivity: (userId: number) => `${API_BASE_URL}/users/${userId}/activity`,

    // Engagement
    triggerEngagement: `${API_BASE_URL}/run-engagement-cycle/`,
    userMessages: (userId: number) => `${API_BASE_URL}/messages/${userId}`,

    // Utility Messaging
    sendReminder: `${API_BASE_URL}/utility/send-reminder`,
    broadcast: `${API_BASE_URL}/utility/broadcast`,
    
    // Analytics
    analyticsMetrics: (days: number = 7) => `${API_BASE_URL}/analytics/metrics?days=${days}`,
    trackMessage: (messageId: number) => `${API_BASE_URL}/analytics/track/${messageId}`,
};

export const api = {
    // Generic fetch wrapper
    async post(url: string, data: any) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    async get(url: string) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    }
};
