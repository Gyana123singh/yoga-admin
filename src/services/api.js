import {
  DASHBOARD_STATS,
  REVENUE_RETENTION_SERIES,
  DAILY_PRACTICE_DISTRIBUTION,
  SMARTWATCH_USAGE_STATS,
  COUNTRY_ANALYTICS,
  MOCK_USERS,
  MOCK_RECOMMENDATIONS_RULES,
  MOCK_ASANAS,
  MOCK_BREATHING_TECHNIQUES,
  MOCK_LIVE_CLASSES,
  MOCK_RECENT_NOTIFICATIONS
} from '../constants/mockData';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const LIVE_API_URL = import.meta.env.VITE_LIVE_API_URL || 'https://api.yogapranafitness.com/api';
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function getTargetUrls() {
  const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
  const isNonLocalhost = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  return isNonLocalhost ? [secondaryUrl, primaryUrl] : [primaryUrl, secondaryUrl];
}

// Smart auto-failover: Try VITE_API_BASE_URL (localhost) first; if unavailable, failover to VITE_LIVE_API_URL
async function request(endpoint, options = {}) {
  const targetUrls = getTargetUrls();

  const adminToken = localStorage.getItem('aura_admin_token');
  const authHeaders = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};

  for (const baseUrl of targetUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout per attempt

      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      const json = await res.json().catch(() => null);
      if (res.ok) {
        return json;
      }

      // If server responded with 400/401/403, return json error response payload directly
      if (res.status >= 400 && res.status < 500 && json) {
        return json;
      }
    } catch (err) {
      console.warn(`[API Auto-Failover] ${baseUrl}${endpoint} failed (${err.message}). Retrying on live server...`);
    }
  }

  console.warn(`[API Fallback] Both local & live backends unavailable for ${endpoint}. Using fallback state.`);
  return null;
}

export const api = {
  BACKEND_URL,
  API_BASE_URL,

  // Admin Auth API
  async adminLogin(credentials) {
    const data = await request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return data;
  },

  async checkAdminSession() {
    const data = await request('/auth/admin-me', {
      method: 'GET'
    });
    return data;
  },


  // Dashboard API
  async getDashboardStats() {
    const data = await request('/dashboard/stats');
    if (data && data.success) return data;
    return {
      success: true,
      stats: DASHBOARD_STATS,
      revenueRetentionSeries: REVENUE_RETENTION_SERIES,
      dailyPracticeDistribution: DAILY_PRACTICE_DISTRIBUTION,
      countryAnalytics: COUNTRY_ANALYTICS,
      recentNotifications: MOCK_RECENT_NOTIFICATIONS,
      liveClasses: MOCK_LIVE_CLASSES,
      healthSyncs: SMARTWATCH_USAGE_STATS
    };
  },

  // Users / Members API
  async getUsers(planType = 'All') {
    const query = planType !== 'All' ? `?planType=${planType}` : '';
    const data = await request(`/users${query}`);
    if (data && data.success) return data.data;
    const validMocks = MOCK_USERS.filter(u => u.authProvider !== 'admin' && u.id !== 'USR-ADMIN-01');
    return planType === 'All' ? validMocks : validMocks.filter(u => u.planType === planType);
  },

  async createUser(memberData) {
    const data = await request('/users', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    if (data && data.success) return data.data;
    return {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...memberData,
      plan: memberData.planType === 'Premium' ? 'Pro Annual ($149/yr)' : 'Starter Free',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      streak: 1,
      totalMinutes: 0,
      hrvAvg: '68 ms',
      sleepScore: '85/100',
      aiPromptsCount: 0
    };
  },

  async updateUser(id, updateData) {
    const data = await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return { id, ...updateData };
  },

  async deleteUser(id) {
    return await request(`/users/${id}`, { method: 'DELETE' });
  },

  // Asanas API
  async getAsanas() {
    const data = await request('/asanas');
    if (data && data.success) return data.data;
    return [];
  },

  async createAsana(asanaData) {
    const data = await request('/asanas', {
      method: 'POST',
      body: JSON.stringify(asanaData),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async updateAsana(id, updateData) {
    const data = await request(`/asanas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteAsana(id) {
    return await request(`/asanas/${id}`, { method: 'DELETE' });
  },

  // Breathing API
  async getBreathingTechniques() {
    const data = await request('/breathing');
    if (data && data.success) return data.data;
    return [];
  },

  async createBreathingTechnique(dataObj) {
    if (dataObj instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/breathing`, { method: 'POST', body: dataObj });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/breathing', {
      method: 'POST',
      body: JSON.stringify(dataObj),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async updateBreathingTechnique(id, updateData) {
    if (updateData instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/breathing/${id}`, { method: 'PUT', body: updateData });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request(`/breathing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteBreathingTechnique(id) {
    return await request(`/breathing/${id}`, { method: 'DELETE' });
  },

  // Exercises API
  async getExercises() {
    const data = await request('/exercises');
    if (data && data.success) return data.data;
    return [];
  },

  async createExercise(dataObj) {
    if (dataObj instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/exercises`, { method: 'POST', body: dataObj });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/exercises', {
      method: 'POST',
      body: JSON.stringify(dataObj),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async updateExercise(id, updateData) {
    if (updateData instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/exercises/${id}`, { method: 'PUT', body: updateData });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteExercise(id) {
    return await request(`/exercises/${id}`, { method: 'DELETE' });
  },

  // Recommendation Rules API
  async getRecommendationRules() {
    const data = await request('/recommendations');
    if (data && data.success) return data.data;
    return MOCK_RECOMMENDATIONS_RULES;
  },

  async createRecommendationRule(ruleData) {
    const data = await request('/recommendations', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
    if (data && data.success) return data.data;
    return {
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      ...ruleData,
      status: 'Active',
      matchCount: 120
    };
  },

  async deleteRecommendationRule(id) {
    return await request(`/recommendations/${id}`, { method: 'DELETE' });
  },

  // AI Generator API
  async generateAIPractice(promptData) {
    const data = await request('/ai-generator/generate', {
      method: 'POST',
      body: JSON.stringify(promptData),
    });
    if (data && data.success) return data.routine;
    return {
      title: `AI Generated ${promptData.targetFocus || 'Holistic Wellness'} Routine`,
      description: promptData.userPrompt || 'Customized practice flow.',
      targetFocus: promptData.targetFocus || 'Full Body Flexibility',
      duration: promptData.duration || '20 Mins',
      difficulty: promptData.difficulty || 'Beginner',
      estimatedCalories: 145,
      parasympatheticActivationScore: '94/100',
      poses: [
        { name: 'Adho Mukha Svanasana (Down Dog)', holdTime: '60s', breathingPattern: 'Inhale through nose', notes: 'Keep spine elongated.' },
        { name: 'Virabhadrasana II (Warrior II)', holdTime: '45s each side', breathingPattern: 'Ujjayi breath', notes: 'Soft gaze over fingertips.' },
        { name: 'Savasana (Corpse Pose)', holdTime: '5 mins', breathingPattern: 'Natural breath', notes: 'Full body relaxation.' }
      ]
    };
  },

  async getAICoaches() {
    const data = await request('/ai-generator/coaches');
    if (data && data.success) return data.data;
    return [];
  },

  // Practice Builder API
  async getPractices() {
    const data = await request('/practices');
    if (data && data.success) return data.data;
    return [];
  },

  async createPractice(practiceData) {
    const data = await request('/practices', {
      method: 'POST',
      body: JSON.stringify(practiceData),
    });
    if (data && data.success) return data.data;
    return { id: Date.now().toString(), ...practiceData };
  },

  async deletePractice(id) {
    return await request(`/practices/${id}`, { method: 'DELETE' });
  },

  // Subscriptions & Coupons API
  async getSubscriptionsSummary() {
    const data = await request('/subscriptions/summary');
    if (data && data.success) return data.summary;
    return null;
  },

  async getCoupons() {
    const data = await request('/subscriptions/coupons');
    if (data && data.success) return data.data;
    return [];
  },

  async createCoupon(couponData) {
    const data = await request('/subscriptions/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
    if (data && data.success) return data.data;
    return { code: couponData.code, ...couponData };
  },

  async deleteCoupon(id) {
    return await request(`/subscriptions/coupons/${id}`, { method: 'DELETE' });
  },

  // Health Integration API
  async getHealthStats() {
    const data = await request('/health');
    if (data && data.success) return data;
    return { devices: SMARTWATCH_USAGE_STATS };
  },

  // Settings API
  async getSettings() {
    const data = await request('/settings');
    if (data && data.success) return data.data;
    return null;
  },

  async updateSettings(settingsData) {
    const data = await request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
    if (data && data.success) return data.data;
    return settingsData;
  },

  // Daily Needs API (Feelings, Focus Areas, Durations, Session Templates)
  async getDailyNeedsConfig() {
    const data = await request('/daily-needs/config');
    if (data && data.success) return data.data;
    return { feelings: [], focusAreas: [], durations: [], sessions: [] };
  },

  async createFeeling(feelingData) {
    const data = await request('/daily-needs/feelings', { method: 'POST', body: JSON.stringify(feelingData) });
    if (data && data.success) return data.data;
    return { _id: Date.now().toString(), ...feelingData };
  },

  async updateFeeling(id, feelingData) {
    const data = await request(`/daily-needs/feelings/${id}`, { method: 'PUT', body: JSON.stringify(feelingData) });
    if (data && data.success) return data.data;
    return { _id: id, ...feelingData };
  },

  async deleteFeeling(id) {
    return await request(`/daily-needs/feelings/${id}`, { method: 'DELETE' });
  },

  async createFocusArea(focusData) {
    const data = await request('/daily-needs/focus-areas', { method: 'POST', body: JSON.stringify(focusData) });
    if (data && data.success) return data.data;
    return { _id: Date.now().toString(), ...focusData };
  },

  async updateFocusArea(id, focusData) {
    const data = await request(`/daily-needs/focus-areas/${id}`, { method: 'PUT', body: JSON.stringify(focusData) });
    if (data && data.success) return data.data;
    return { _id: id, ...focusData };
  },

  async deleteFocusArea(id) {
    return await request(`/daily-needs/focus-areas/${id}`, { method: 'DELETE' });
  },

  async createDuration(durationData) {
    const data = await request('/daily-needs/durations', { method: 'POST', body: JSON.stringify(durationData) });
    if (data && data.success) return data.data;
    return { _id: Date.now().toString(), ...durationData };
  },

  async updateDuration(id, durationData) {
    const data = await request(`/daily-needs/durations/${id}`, { method: 'PUT', body: JSON.stringify(durationData) });
    if (data && data.success) return data.data;
    return { _id: id, ...durationData };
  },

  async deleteDuration(id) {
    return await request(`/daily-needs/durations/${id}`, { method: 'DELETE' });
  },

  async createSessionConfig(sessionData) {
    const data = await request('/daily-needs/sessions', { method: 'POST', body: JSON.stringify(sessionData) });
    if (data && data.success) return data.data;
    return { _id: Date.now().toString(), ...sessionData };
  },

  async updateSessionConfig(id, sessionData) {
    const data = await request(`/daily-needs/sessions/${id}`, { method: 'PUT', body: JSON.stringify(sessionData) });
    if (data && data.success) return data.data;
    return { _id: id, ...sessionData };
  },

  async deleteSessionConfig(id) {
    return await request(`/daily-needs/sessions/${id}`, { method: 'DELETE' });
  },

  async resolvePersonalSession(payload) {
    const data = await request('/daily-needs/resolve-session', { method: 'POST', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  // Video API with smart auto-failover
  async getVideos(feeling = '') {
    const query = feeling ? `?feeling=${feeling}` : '';
    const data = await request(`/videos${query}`);
    if (data && data.success) return data.data;
    return [];
  },

  async uploadVideo(formData) {
    for (const baseUrl of getTargetUrls()) {
      try {
        const res = await fetch(`${baseUrl}/videos/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[Video Upload Failover] ${baseUrl} failed, trying secondary...`);
      }
    }
    return null;
  },

  async uploadYogaProgramVideo(formData) {
    for (const baseUrl of getTargetUrls()) {
      try {
        const res = await fetch(`${baseUrl}/yoga-programs/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`[Yoga Program Upload Failover] ${baseUrl} failed, trying secondary...`);
      }
    }
    return null;
  },

  async deleteVideo(id) {
    return await request(`/videos/${id}`, { method: 'DELETE' });
  },

  // Quick Practice & SOS Breathing API
  async getQuickPractices(category = '') {
    const q = category ? `?category=${category}` : '';
    const data = await request(`/quick-practices${q}`);
    if (data && data.success) return data.data;
    return { all: [], quickTimers: [], sosMoments: [] };
  },

  async getQuickPracticeById(id) {
    const data = await request(`/quick-practices/${id}`);
    if (data && data.success) return data.data;
    return null;
  },

  async createQuickPractice(payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/quick-practices`, { method: 'POST', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/quick-practices', { method: 'POST', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async updateQuickPractice(id, payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/quick-practices/${id}`, { method: 'PUT', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request(`/quick-practices/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteQuickPractice(id) {
    return await request(`/quick-practices/${id}`, { method: 'DELETE' });
  },

  // Goal-Based Yoga Programs API
  async getYogaPrograms(goalCategory = '') {
    const q = goalCategory && goalCategory !== 'All Goals' ? `?goalCategory=${goalCategory}` : '';
    const data = await request(`/yoga-programs${q}`);
    if (data && data.success) return data.data;
    return [];
  },

  async getYogaProgramById(id) {
    const data = await request(`/yoga-programs/${id}`);
    if (data && data.success) return data.data;
    return null;
  },

  async createYogaProgram(payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/yoga-programs`, { method: 'POST', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/yoga-programs', { method: 'POST', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async updateYogaProgram(id, payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/yoga-programs/${id}`, { method: 'PUT', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request(`/yoga-programs/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteYogaProgram(id) {
    return await request(`/yoga-programs/${id}`, { method: 'DELETE' });
  },

  async logProgramDayCompletion(programId, dayNumber) {
    const data = await request(`/yoga-programs/${programId}/log-day`, {
      method: 'POST',
      body: JSON.stringify({ dayNumber })
    });
    if (data && data.success) return data.data;
    return null;
  },

  // Daily Schedule & Calendar API
  async getCalendarCategories() {
    const data = await request('/daily-schedule/categories');
    if (data && data.success) return data.data;
    return [];
  },

  async saveCalendarCategory(payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/daily-schedule/categories`, { method: 'POST', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/daily-schedule/categories', { method: 'POST', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteCalendarCategory(id) {
    return await request(`/daily-schedule/categories/${id}`, { method: 'DELETE' });
  },

  async getDailySchedulesByDate(dateStr = '') {
    const q = dateStr ? `?date=${dateStr}` : '';
    const data = await request(`/daily-schedule${q}`);
    if (data && data.success) return data;
    return { data: [], meta: { total: 0, completedCount: 0 } };
  },

  async addDailySchedule(payload) {
    if (payload instanceof FormData) {
      const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;
      for (const baseUrl of [primaryUrl, secondaryUrl]) {
        try {
          const res = await fetch(`${baseUrl}/daily-schedule`, { method: 'POST', body: payload });
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
        } catch (e) { }
      }
      return null;
    }
    const data = await request('/daily-schedule', { method: 'POST', body: JSON.stringify(payload) });
    if (data && data.success) return data.data;
    return null;
  },

  async toggleDailyScheduleStatus(id) {
    const data = await request(`/daily-schedule/${id}/toggle-complete`, { method: 'PUT' });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteDailySchedule(id) {
    return await request(`/daily-schedule/${id}`, { method: 'DELETE' });
  },

  // Real-Time Notifications API
  async getNotifications() {
    const data = await request('/notifications');
    if (data && data.success) return data.data;
    return [];
  },

  async sendRealtimeNotification(payload) {
    const data = await request('/notifications/send-realtime', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data && data.success) return data.data;
    return null;
  },

  async markNotificationRead(id) {
    const data = await request(`/notifications/${id}/read`, { method: 'PUT' });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteNotification(id) {
    return await request(`/notifications/${id}`, { method: 'DELETE' });
  },

  // Support Tickets API
  async getTickets(status = 'ALL', search = '') {
    const data = await request(`/tickets?status=${status}&search=${search}`);
    if (data && data.success) return data.data;
    return [];
  },

  async getTicketById(id) {
    const data = await request(`/tickets/${id}`);
    if (data && data.success) return data.data;
    return null;
  },

  async createTicket(payload) {
    const data = await request('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data && data.success) return data.data;
    return null;
  },

  async replyTicket(id, payload) {
    const data = await request(`/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data && data.success) return data.data;
    return null;
  },

  async updateTicketStatus(id, status) {
    const data = await request(`/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    if (data && data.success) return data.data;
    return null;
  },

  async deleteTicket(id) {
    return await request(`/tickets/${id}`, { method: 'DELETE' });
  },

  async getDailyScheduleMonthStats(year = 2026, month = 7) {
    const data = await request(`/daily-schedule/month-stats?year=${year}&month=${month}`);
    if (data && data.success) return data.data;
    return { completedDays: 0, partiallyCompleted: 0, missedDays: 31, activeDatesWithStatus: {} };
  },

  async getDailyScheduleWeekStats() {
    const data = await request('/daily-schedule/week-stats');
    if (data && data.success) return data.data;
    return null;
  },

  // Database Seed API
  async seedDatabase() {
    return await request('/seed', { method: 'POST' });
  }
};

// Smart Socket Auto-Failover Helper (Tries local ws://localhost:5000 first, failovers to live WS server)
export function createSmartSocket(feeling, onUpdate) {
  const WS_LOCAL = 'ws://localhost:5000/socket.io/?EIO=4&transport=websocket';
  const WS_LIVE = LIVE_API_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '') + '/socket.io/?EIO=4&transport=websocket';

  let ws = null;
  try {
    ws = new WebSocket(WS_LOCAL);

    ws.onopen = () => {
      console.log('⚡ [Client Socket] Connected to Local WebSocket server');
    };

    ws.onmessage = (event) => {
      if (onUpdate) onUpdate(event.data);
    };

    ws.onerror = () => {
      console.warn('[Socket Auto-Failover] Local WS unavailable. Connecting to live server...');
      try {
        ws = new WebSocket(WS_LIVE);
        ws.onopen = () => console.log('⚡ [Client Socket] Connected to Live WebSocket server');
        ws.onmessage = (event) => { if (onUpdate) onUpdate(event.data); };
      } catch (e) {
        console.warn('Live WS fallback error:', e);
      }
    };
  } catch (err) {
    console.warn('WebSocket init fallback:', err);
  }

  return {
    disconnect: () => {
      if (ws) ws.close();
    }
  };
}


