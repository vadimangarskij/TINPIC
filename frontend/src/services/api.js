import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    } catch (e) {
      console.error('Token parse error:', e);
    }
  }
  return config;
});

// API methods
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updateLocation: (data) => api.post('/users/location', data),
};

export const discoveryAPI = {
  getCards: (limit = 10) => api.get(`/discovery?limit=${limit}`),
  swipe: (data) => api.post('/swipe', data),
  undoSwipe: () => api.post('/swipe/undo'),
};

export const matchesAPI = {
  getMatches: () => api.get('/matches'),
  getReceivedLikes: () => api.get('/likes/received'),
};

export const messagesAPI = {
  getMessages: (matchId) => api.get(`/messages/${matchId}`),
  sendMessage: (data) => api.post('/messages', data),
  getIcebreaker: (matchId) => api.get(`/messages/icebreaker/${matchId}`),
};

export const premiumAPI = {
  subscribe: (planType, paymentMethod) => api.post('/premium/subscribe', { plan_type: planType, payment_method: paymentMethod }),
  purchaseCoins: (packageType, paymentMethod) => api.post('/coins/purchase', { package: packageType, payment_method: paymentMethod }),
  getCoinBalance: () => api.get('/coins/balance'),
};

export default api;
