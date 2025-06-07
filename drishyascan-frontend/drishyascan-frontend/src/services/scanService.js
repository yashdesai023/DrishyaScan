import api from './api';

const scanService = {
  // Start a new scan
  startScan: async (websiteId, scanConfig) => {
    const response = await api.post(`/websites/${websiteId}/scan`, scanConfig);
    return response.data;
  },

  // Get scan status
  getScanStatus: async (scanId) => {
    const response = await api.get(`/scans/${scanId}/status`);
    return response.data;
  },

  // Get scan results
  getScanResults: async (scanId) => {
    const response = await api.get(`/scans/${scanId}/results`);
    return response.data;
  },

  // Get scan issues
  getScanIssues: async (scanId) => {
    const response = await api.get(`/scans/${scanId}/issues`);
    return response.data;
  },

  // Get scan history for a website
  getWebsiteScanHistory: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/scans`);
    return response.data;
  },

  // Cancel a running scan
  cancelScan: async (scanId) => {
    const response = await api.post(`/scans/${scanId}/cancel`);
    return response.data;
  },

  // Get scan configuration
  getScanConfig: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/scan-config`);
    return response.data;
  },

  // Update scan configuration
  updateScanConfig: async (websiteId, config) => {
    const response = await api.put(`/websites/${websiteId}/scan-config`, config);
    return response.data;
  },

  // Get scan statistics
  getScanStats: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/scan-stats`);
    return response.data;
  },
};

export default scanService; 