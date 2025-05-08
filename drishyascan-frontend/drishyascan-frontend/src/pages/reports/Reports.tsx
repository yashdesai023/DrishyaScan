import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentArrowDownIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { scanApi, reportApi } from 'services/api';
import { Scan, Issue, IssueSeverity, IssueType } from 'types/scan';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

interface ScanStats {
  totalScans: number;
  completedScans: number;
  failedScans: number;
  totalIssues: number;
  issuesBySeverity: Record<IssueSeverity, number>;
  issuesByType: Record<IssueType, number>;
  averageScanDuration: number;
  dailyStats: {
    date: string;
    scans: number;
    issues: number;
  }[];
}

interface ReportGenerationState {
  isGenerating: boolean;
  reportId: string | null;
  status: 'idle' | 'generating' | 'ready' | 'failed';
  error: string | null;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [reportState, setReportState] = useState<ReportGenerationState>({
    isGenerating: false,
    reportId: null,
    status: 'idle',
    error: null
  });

  useEffect(() => {
    fetchStats();
  }, [timeRange, selectedWebsite, selectedProject]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all scans for the selected time range and filters
      const scans = await scanApi.getScans(timeRange);
      
      // Calculate statistics
      const stats: ScanStats = {
        totalScans: scans.length,
        completedScans: scans.filter(scan => scan.status === 'completed').length,
        failedScans: scans.filter(scan => scan.status === 'failed').length,
        totalIssues: scans.reduce((sum, scan) => sum + scan.issues.length, 0),
        issuesBySeverity: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        issuesByType: {
          security: 0,
          performance: 0,
          accessibility: 0,
          seo: 0
        },
        averageScanDuration: 0,
        dailyStats: []
      };

      // Calculate issue statistics
      scans.forEach(scan => {
        scan.issues.forEach(issue => {
          stats.issuesBySeverity[issue.severity]++;
          stats.issuesByType[issue.type]++;
        });
      });

      // Calculate average scan duration
      const completedScans = scans.filter(scan => scan.duration);
      if (completedScans.length > 0) {
        stats.averageScanDuration = completedScans.reduce((sum, scan) => sum + (scan.duration || 0), 0) / completedScans.length;
      }

      // Calculate daily statistics
      const dailyStats = new Map<string, { scans: number; issues: number }>();
      scans.forEach(scan => {
        const date = new Date(scan.startTime).toISOString().split('T')[0];
        const current = dailyStats.get(date) || { scans: 0, issues: 0 };
        dailyStats.set(date, {
          scans: current.scans + 1,
          issues: current.issues + scan.issues.length
        });
      });

      stats.dailyStats = Array.from(dailyStats.entries()).map(([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setStats(stats);
    } catch (err) {
      setError('Failed to fetch scan statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'accessibility' | 'compliance' | 'summary', format: 'pdf' | 'html' | 'json') => {
    try {
      setReportState(prev => ({ ...prev, isGenerating: true, status: 'generating', error: null }));
      const { reportId } = await reportApi.generateReport(selectedWebsite, type, format);
      setReportState(prev => ({ ...prev, reportId, status: 'generating' }));

      // Poll for report status
      const checkStatus = async () => {
        const { status } = await reportApi.getReportStatus(reportId);
        if (status === 'ready') {
          setReportState(prev => ({ ...prev, status: 'ready' }));
          // Download the report
          const blob = await reportApi.downloadReport(reportId);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report-${type}-${new Date().toISOString()}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else if (status === 'failed') {
          setReportState(prev => ({ ...prev, status: 'failed', error: 'Report generation failed' }));
        } else {
          setTimeout(checkStatus, 2000);
        }
      };

      checkStatus();
    } catch (err) {
      setReportState(prev => ({
        ...prev,
        status: 'failed',
        error: 'Failed to generate report'
      }));
    } finally {
      setReportState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const severityColors = {
    critical: '#DC2626',
    high: '#F59E0B',
    medium: '#3B82F6',
    low: '#10B981'
  };

  const typeColors = {
    security: '#DC2626',
    performance: '#F59E0B',
    accessibility: '#3B82F6',
    seo: '#10B981'
  };

  const severityChartData = {
    labels: Object.keys(stats?.issuesBySeverity || {}),
    datasets: [{
      data: Object.values(stats?.issuesBySeverity || {}),
      backgroundColor: Object.values(severityColors),
      borderColor: Object.values(severityColors).map(color => color + '80'),
      borderWidth: 1
    }]
  };

  const typeChartData = {
    labels: Object.keys(stats?.issuesByType || {}),
    datasets: [{
      data: Object.values(stats?.issuesByType || {}),
      backgroundColor: Object.values(typeColors),
      borderColor: Object.values(typeColors).map(color => color + '80'),
      borderWidth: 1
    }]
  };

  const trendChartData = {
    labels: stats?.dailyStats.map(stat => stat.date) || [],
    datasets: [
      {
        label: 'Scans',
        data: stats?.dailyStats.map(stat => stat.scans) || [],
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F680',
        tension: 0.4
      },
      {
        label: 'Issues',
        data: stats?.dailyStats.map(stat => stat.issues) || [],
        borderColor: '#DC2626',
        backgroundColor: '#DC262680',
        tension: 0.4
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Scan Reports</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="form-select"
          >
            <option value="all">All Projects</option>
            {/* Add project options */}
          </select>
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="form-select"
          >
            <option value="all">All Websites</option>
            {/* Add website options */}
          </select>
          <button
            onClick={() => generateReport('summary', 'pdf')}
            disabled={reportState.isGenerating}
            className="btn-primary flex items-center gap-2"
          >
            <DocumentChartBarIcon className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded ${
              timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Last Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${
              timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded ${
              timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            Last Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Total Scans</h3>
          <p className="text-3xl font-bold">{stats?.totalScans}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Completed Scans</h3>
          <p className="text-3xl font-bold text-green-500">{stats?.completedScans}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Failed Scans</h3>
          <p className="text-3xl font-bold text-red-500">{stats?.failedScans}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Total Issues</h3>
          <p className="text-3xl font-bold">{stats?.totalIssues}</p>
        </div>
      </div>

      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Trend Analysis</h3>
        <div className="h-80">
          <Line
            data={trendChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Issues by Severity</h3>
          <div className="h-64">
            <Pie data={severityChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Issues by Type</h3>
          <div className="h-64">
            <Pie data={typeChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Average Scan Duration</h3>
        <p className="text-3xl font-bold">
          {stats?.averageScanDuration.toFixed(2)} seconds
        </p>
      </div>

      {reportState.status !== 'idle' && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-2">
            {reportState.status === 'generating' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
            <span>
              {reportState.status === 'generating' && 'Generating report...'}
              {reportState.status === 'ready' && 'Report ready!'}
              {reportState.status === 'failed' && 'Failed to generate report'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 