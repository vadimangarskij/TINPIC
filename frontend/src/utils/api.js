import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/users/me'),
};

// Users
export const usersAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (updates) => api.put('/users/me', updates),
  updateLocation: (location) => api.post('/users/location', location),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/users/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deletePhoto: (photoIndex) => api.delete(`/users/photos/${photoIndex}`),
  reorderPhotos: (photoOrder) => api.put('/users/photos/reorder', { photo_order: photoOrder }),
};

// Discovery
export const discoveryAPI = {
  getCards: (limit = 10) => api.get(`/discovery?limit=${limit}`),
  swipe: (swipeData) => api.post('/swipe', swipeData),
  undoSwipe: () => api.post('/swipe/undo'),
};

// Matches
export const matchesAPI = {
  getMatches: () => api.get('/matches'),
  getReceivedLikes: () => api.get('/likes/received'),
};

// Messages
export const messagesAPI = {
  getMessages: (matchId, limit = 50) => api.get(`/messages/${matchId}?limit=${limit}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  getIcebreaker: (matchId) => api.get(`/messages/icebreaker/${matchId}`),
};

// Premium & Coins
export const premiumAPI = {
  subscribe: (planType, paymentMethod) => 
    api.post('/premium/subscribe', { plan_type: planType, payment_method: paymentMethod }),
  purchaseCoins: (packageType, paymentMethod) =>
    api.post('/coins/purchase', { package: packageType, payment_method: paymentMethod }),
  getCoinBalance: () => api.get('/coins/balance'),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingUsers: () => api.get('/admin/users/pending'),
  approveUser: (userId) => api.post(`/admin/users/${userId}/approve`),
  rejectUser: (userId, reason) => api.post(`/admin/users/${userId}/reject`, { reason }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settingKey, settingValue) =>
    api.post('/admin/settings', { setting_key: settingKey, setting_value: settingValue }),
  getTransactionStats: () => api.get('/admin/transactions/stats'),
  getTransactions: (limit = 50, offset = 0, status = null) => {
    let url = `/admin/transactions?limit=${limit}&offset=${offset}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
};

export default api;
