import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from 'types/auth';
import { Project } from 'types/project';
import { Website } from 'types/website';
import { Scan, Issue } from 'types/scan';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },
};

// Project API
export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: { name: string; description?: string }): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: { name: string; description?: string }): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Website API
export const websiteApi = {
  getWebsites: async (): Promise<Website[]> => {
    const response = await api.get('/websites');
    return response.data;
  },

  getWebsite: async (id: string): Promise<Website> => {
    const response = await api.get(`/websites/${id}`);
    return response.data;
  },

  createWebsite: async (data: { url: string; projectId: string }): Promise<Website> => {
    const response = await api.post('/websites', data);
    return response.data;
  },

  updateWebsite: async (id: string, data: { url: string; projectId: string }): Promise<Website> => {
    const response = await api.put(`/websites/${id}`, data);
    return response.data;
  },

  deleteWebsite: async (id: string): Promise<void> => {
    await api.delete(`/websites/${id}`);
  },

  startScan: async (id: string): Promise<Scan> => {
    const response = await api.post(`/websites/${id}/scan`);
    return response.data;
  },
};

// Scan API
export const scanApi = {
  getScans: async (timeRange?: 'week' | 'month' | 'year'): Promise<Scan[]> => {
    const response = await api.get('/scans', {
      params: { timeRange }
    });
    return response.data;
  },

  getScan: async (id: string): Promise<Scan> => {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  },

  getWebsiteScans: async (websiteId: string): Promise<Scan[]> => {
    const response = await api.get(`/websites/${websiteId}/scans`);
    return response.data;
  },

  startScan: async (websiteId: string): Promise<Scan> => {
    const response = await api.post(`/websites/${websiteId}/scan`);
    return response.data;
  },

  getScanIssues: async (scanId: string): Promise<Issue[]> => {
    const response = await api.get(`/scans/${scanId}/issues`);
    return response.data;
  },
};

// Report API
export const reportApi = {
  getScanStats: async (timeRange: 'week' | 'month' | 'year'): Promise<Scan[]> => {
    const response = await api.get('/reports/stats', {
      params: { timeRange }
    });
    return response.data;
  },

  generateReport: async (
    scanId: string,
    type: 'accessibility' | 'compliance' | 'summary',
    format: 'pdf' | 'html' | 'json'
  ): Promise<{ reportId: string }> => {
    const response = await api.post('/reports/generate', {
      scanId,
      type,
      format
    });
    return response.data;
  },

  getReportStatus: async (reportId: string): Promise<{ status: 'generating' | 'ready' | 'failed' }> => {
    const response = await api.get(`/reports/${reportId}/status`);
    return response.data;
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
}; 