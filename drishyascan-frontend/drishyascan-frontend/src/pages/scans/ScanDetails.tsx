import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Scan, IssueSeverity } from 'types/scan';
import { scanApi } from 'services/api';

const ScanDetails: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScan = async () => {
      if (!scanId) return;
      try {
        setIsLoading(true);
        const data = await scanApi.getScan(scanId);
        setScan(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch scan details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScan();
  }, [scanId]);

  const getStatusColor = (status: Scan['status']) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSeverityCount = (severity: IssueSeverity) => {
    return scan?.issues.filter(issue => issue.severity === severity).length || 0;
  };

  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="card text-center py-12">
        <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
        <h3 className="text-lg font-medium mb-2">Scan Not Found</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          The requested scan could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Scan Details</h1>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          {scan.status === 'completed' && (
            <button
              className="btn-primary"
              onClick={() => navigate(`/issues/${scan.id}`)}
            >
              View Issues
            </button>
          )}
        </div>
      </div>

      {/* Scan Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            {scan.status === 'running' ? (
              <ArrowPathIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
            ) : scan.status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Status
              </h3>
              <p className={`font-medium ${getStatusColor(scan.status)}`}>
                {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Duration
              </h3>
              <p className="font-medium">
                {scan.duration ? `${scan.duration} seconds` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Total Issues
              </h3>
              <p className="font-medium">{scan.issues.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Critical Issues
              </h3>
              <p className="font-medium text-red-600 dark:text-red-400">
                {getSeverityCount('critical')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Summary */}
      <div className="card">
        <h2 className="text-lg font-medium mb-4">Scan Summary</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Website
            </h3>
            <a
              href={scan.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {scan.websiteUrl}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Started At
            </h3>
            <p>{new Date(scan.startedAt).toLocaleString()}</p>
          </div>

          {scan.completedAt && (
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Completed At
              </h3>
              <p>{new Date(scan.completedAt).toLocaleString()}</p>
            </div>
          )}

          {scan.error && (
            <div>
              <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Error
              </h3>
              <p className="text-red-600 dark:text-red-400">{scan.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Issue Summary */}
      {scan.status === 'completed' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Issue Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['critical', 'high', 'medium', 'low'] as IssueSeverity[]).map((severity) => (
              <div
                key={severity}
                className={`p-4 rounded-lg ${getSeverityColor(severity)}`}
              >
                <h3 className="text-sm font-medium mb-1">
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </h3>
                <p className="text-2xl font-bold">
                  {getSeverityCount(severity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanDetails; 