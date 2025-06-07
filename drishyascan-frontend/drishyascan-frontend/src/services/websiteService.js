import api from './api';

const websiteService = {
  // Get all websites
  getWebsites: async () => {
    const response = await api.get('/websites');
    return response.data;
  },

  // Get a specific website
  getWebsite: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}`);
    return response.data;
  },

  // Create a new website
  createWebsite: async (projectId, websiteData) => {
    const response = await api.post(`/projects/${projectId}/websites`, websiteData);
    return response.data;
  },

  // Update a website
  updateWebsite: async (websiteId, websiteData) => {
    const response = await api.put(`/websites/${websiteId}`, websiteData);
    return response.data;
  },

  // Delete a website
  deleteWebsite: async (websiteId) => {
    const response = await api.delete(`/websites/${websiteId}`);
    return response.data;
  },

  // Start a scan
  startScan: async (websiteId, scanConfig) => {
    const response = await api.post(`/websites/${websiteId}/scan`, scanConfig);
    return response.data;
  },

  // Get scan results
  getScanResults: async (websiteId, scanId) => {
    const response = await api.get(`/websites/${websiteId}/scans/${scanId}`);
    return response.data;
  },

  // Get website issues
  getWebsiteIssues: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/issues`);
    return response.data;
  },
};

export default websiteService; 