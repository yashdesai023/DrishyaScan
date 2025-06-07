import api from './api';

const reportService = {
  // Get all reports for a project
  getProjectReports: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/reports`);
    return response.data;
  },

  // Get a specific report
  getReport: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  // Generate a new report
  generateReport: async (projectId, reportData) => {
    const response = await api.post(`/projects/${projectId}/reports`, reportData);
    return response.data;
  },

  // Download a report
  downloadReport: async (reportId, format) => {
    const response = await api.get(`/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete a report
  deleteReport: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },

  // Get report statistics
  getReportStats: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/reports/stats`);
    return response.data;
  },
};

export default reportService; 