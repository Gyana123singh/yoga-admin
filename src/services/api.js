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
export const LIVE_API_URL = import.meta.env.VITE_LIVE_API_URL || 'https://apiyoga.hirehand.co.in/api';
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Smart auto-failover: Try VITE_API_BASE_URL (localhost) first; if unavailable, failover to VITE_LIVE_API_URL
async function request(endpoint, options = {}) {
  const primaryUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const secondaryUrl = LIVE_API_URL.endsWith('/') ? LIVE_API_URL.slice(0, -1) : LIVE_API_URL;

  const targetUrls = [primaryUrl, secondaryUrl];

  for (const baseUrl of targetUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout per attempt

      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
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
    if (data && data.success) return data;
    return null;
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
    return planType === 'All' ? MOCK_USERS : MOCK_USERS.filter(u => u.planType === planType);
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
    return MOCK_ASANAS;
  },

  async createAsana(asanaData) {
    const data = await request('/asanas', {
      method: 'POST',
      body: JSON.stringify(asanaData),
    });
    if (data && data.success) return data.data;
    return {
      id: `ASN-${Math.floor(10 + Math.random() * 90)}`,
      ...asanaData
    };
  },

  async updateAsana(id, updateData) {
    const data = await request(`/asanas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return { id, ...updateData };
  },

  async deleteAsana(id) {
    return await request(`/asanas/${id}`, { method: 'DELETE' });
  },

  // Breathing API
  async getBreathingTechniques() {
    const data = await request('/breathing');
    if (data && data.success) return data.data;
    return MOCK_BREATHING_TECHNIQUES;
  },

  async createBreathingTechnique(dataObj) {
    const data = await request('/breathing', {
      method: 'POST',
      body: JSON.stringify(dataObj),
    });
    if (data && data.success) return data.data;
    return {
      id: `BRT-${Math.floor(10 + Math.random() * 90)}`,
      ...dataObj
    };
  },

  async updateBreathingTechnique(id, updateData) {
    const data = await request(`/breathing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    if (data && data.success) return data.data;
    return { id, ...updateData };
  },

  async deleteBreathingTechnique(id) {
    return await request(`/breathing/${id}`, { method: 'DELETE' });
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

  // Database Seed API
  async seedDatabase() {
    return await request('/seed', { method: 'POST' });
  }
};
