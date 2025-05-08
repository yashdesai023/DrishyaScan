import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth related API calls
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Scan related API calls
export const scanService = {
  createScan: async (scanData) => {
    const response = await api.post('/scans', scanData);
    return response.data;
  },
  getScanHistory: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/scans`);
    return response.data;
  },
  getScanDetails: async (scanId) => {
    const response = await api.get(`/scans/${scanId}`);
    return response.data;
  },
};

// Project related API calls
export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },
};

export default api;