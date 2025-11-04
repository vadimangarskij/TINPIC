import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
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
  subscribe: (planType, paymentMethod) => 
    api.post('/premium/subscribe', { plan_type: planType, payment_method: paymentMethod }),
  purchaseCoins: (packageType, paymentMethod) => 
    api.post('/coins/purchase', { package: packageType, payment_method: paymentMethod }),
  getCoinBalance: () => api.get('/coins/balance'),
};

export default api;
