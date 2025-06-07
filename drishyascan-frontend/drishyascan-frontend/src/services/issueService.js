import api from './api';

const issueService = {
  // Get all issues for a website
  getWebsiteIssues: async (websiteId) => {
    const response = await api.get(`/websites/${websiteId}/issues`);
    return response.data;
  },

  // Get a specific issue
  getIssue: async (issueId) => {
    const response = await api.get(`/issues/${issueId}`);
    return response.data;
  },

  // Update issue status
  updateIssueStatus: async (issueId, status) => {
    const response = await api.put(`/issues/${issueId}/status`, { status });
    return response.data;
  },

  // Add issue comment
  addIssueComment: async (issueId, comment) => {
    const response = await api.post(`/issues/${issueId}/comments`, { comment });
    return response.data;
  },

  // Get issue comments
  getIssueComments: async (issueId) => {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
  },

  // Get issue history
  getIssueHistory: async (issueId) => {
    const response = await api.get(`/issues/${issueId}/history`);
    return response.data;
  },

  // Assign issue to user
  assignIssue: async (issueId, userId) => {
    const response = await api.put(`/issues/${issueId}/assign`, { userId });
    return response.data;
  },

  // Get issues by severity
  getIssuesBySeverity: async (websiteId, severity) => {
    const response = await api.get(`/websites/${websiteId}/issues/severity/${severity}`);
    return response.data;
  },

  // Get issues by WCAG criteria
  getIssuesByWCAG: async (websiteId, wcagId) => {
    const response = await api.get(`/websites/${websiteId}/issues/wcag/${wcagId}`);
    return response.data;
  },

  // Export issues
  exportIssues: async (websiteId, format) => {
    const response = await api.get(`/websites/${websiteId}/issues/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default issueService; 