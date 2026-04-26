import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tagback_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);
export const getMe = () => API.get('/api/auth/me');

// Items
export const getItems = () => API.get('/api/items');
export const createItem = (data) => API.post('/api/items', data);
export const updateItem = (id, data) => API.put(`/api/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/api/items/${id}`);
export const getItemStats = (id) => API.get(`/api/items/${id}/stats`);

// Scan (public)
export const getScanInfo = (code) => API.get(`/api/scan/${code}`);
export const reportFound = (code, data) => API.post(`/api/scan/${code}/report`, data);

// Chat
export const getMessages = (itemId) => API.get(`/api/chat/${itemId}`);
export const sendOwnerMessage = (itemId, text) => API.post(`/api/chat/${itemId}/owner`, { text });
export const sendFinderMessage = (itemId, text, sessionId) =>
  API.post(`/api/chat/${itemId}/finder`, { text, sessionId });
export const getFinderMessages = (itemId) => API.get(`/api/chat/${itemId}/finder`);

// Payments
export const createRewardOrder = (itemId, amount) =>
  API.post('/api/payments/create-order', { itemId, amount });
export const markReturned = (itemId) =>
  API.post('/api/payments/mark-returned', { itemId });

export default API;
