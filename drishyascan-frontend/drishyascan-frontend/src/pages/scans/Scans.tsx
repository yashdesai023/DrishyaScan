import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Scan } from 'types/scan';
import { scanApi } from 'services/api';

const ITEMS_PER_PAGE = 10;

const Scans: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Scan['status'] | 'all'>('all');
  const [isStartingScan, setIsStartingScan] = useState(false);

  useEffect(() => {
    const fetchScans = async () => {
      if (!websiteId) return;
      try {
        setIsLoading(true);
        const data = await scanApi.getWebsiteScans(websiteId);
        setScans(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch scans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScans();
  }, [websiteId]);

  useEffect(() => {
    let result = [...scans];

    if (statusFilter !== 'all') {
      result = result.filter(scan => scan.status === statusFilter);
    }

    // Sort by startedAt in descending order (newest first)
    result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    setFilteredScans(result);
    setCurrentPage(1);
  }, [scans, statusFilter]);

  const totalPages = Math.ceil(filteredScans.length / ITEMS_PER_PAGE);
  const paginatedScans = filteredScans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStartScan = async () => {
    if (!websiteId) return;
    try {
      setIsStartingScan(true);
      const newScan = await scanApi.startScan(websiteId);
      setScans(prev => [newScan, ...prev]);
      navigate(`/scans/${newScan.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start scan');
    } finally {
      setIsStartingScan(false);
    }
  };

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

  const getStatusIcon = (status: Scan['status']) => {
    switch (status) {
      case 'running':
        return <ArrowPathIcon className="w-5 h-5 animate-spin" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Scans</h1>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back to Website
          </button>
          <button
            className="btn-primary"
            onClick={handleStartScan}
            disabled={isStartingScan}
          >
            {isStartingScan ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                Starting Scan...
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5 mr-2" />
                Start New Scan
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-primary rounded-lg p-4">
        <div className="flex items-center gap-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Scan['status'] | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredScans.length === 0 ? (
        <div className="card text-center py-12">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">No Scans Found</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {statusFilter !== 'all'
              ? 'No scans match the selected status'
              : 'Start a new scan to begin monitoring your website'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Scans List */}
          <div className="bg-white dark:bg-dark-bg-primary rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-bg-primary divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-bg-secondary"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(scan.status)}
                        <span className={`font-medium ${getStatusColor(scan.status)}`}>
                          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(scan.startedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {scan.duration ? `${scan.duration} seconds` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {scan.issues.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/scans/${scan.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="btn-secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-light-text-primary dark:text-dark-text-primary'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scans; 