/**
 * API Service
 * Handles all API calls to Netlify Functions
 */

import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Upload file
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
};

/**
 * Ask question
 */
export const askQuestion = async (question) => {
  const response = await api.post('/ask', { question });
  return response.data;
};

/**
 * List all uploaded files
 */
export const listFiles = async () => {
  const response = await api.get('/listFiles');
  return response.data;
};

/**
 * Delete file
 */
export const deleteFile = async (fileId) => {
  const response = await api.delete('/deleteFile', { data: { fileId } });
  return response.data;
};

export default api;
