import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { Issue, IssueSeverity, IssueStatus, IssueType } from 'types/scan';
import { scanApi } from 'services/api';

interface IssueFilters {
  severity: IssueSeverity | 'all';
  status: IssueStatus | 'all';
  type: IssueType | 'all';
  search: string;
}

const ITEMS_PER_PAGE = 10;

const Issues: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<IssueFilters>({
    severity: 'all',
    status: 'all',
    type: 'all',
    search: '',
  });
  const [sortField, setSortField] = useState<keyof Issue>('severity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchIssues = async () => {
      if (!scanId) return;
      try {
        setIsLoading(true);
        const data = await scanApi.getScanIssues(scanId);
        setIssues(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch issues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [scanId]);

  useEffect(() => {
    let result = [...issues];

    // Apply filters
    if (filters.severity !== 'all') {
      result = result.filter(issue => issue.severity === filters.severity);
    }
    if (filters.status !== 'all') {
      result = result.filter(issue => issue.status === filters.status);
    }
    if (filters.type !== 'all') {
      result = result.filter(issue => issue.type === filters.type);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(issue =>
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower) ||
        issue.element.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredIssues(result);
    setCurrentPage(1);
  }, [issues, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Issue) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'wont_fix':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Issues</h1>
        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back to Scan
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-dark-bg-primary rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues..."
                className="form-input pl-10 w-full"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
            </div>
          </div>
          <select
            className="form-select"
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value as IssueSeverity | 'all' }))}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as IssueStatus | 'all' }))}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="wont_fix">Won't Fix</option>
          </select>
          <select
            className="form-select"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as IssueType | 'all' }))}
          >
            <option value="all">All Types</option>
            <option value="accessibility">Accessibility</option>
            <option value="security">Security</option>
            <option value="performance">Performance</option>
            <option value="seo">SEO</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="card text-center py-12">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {filters.severity !== 'all' || filters.status !== 'all' || filters.type !== 'all' || filters.search
              ? 'Try adjusting your filters'
              : 'No issues were found in this scan'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Issues List */}
          <div className="bg-white dark:bg-dark-bg-primary rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-bg-secondary">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('severity')}
                  >
                    <div className="flex items-center gap-1">
                      Severity
                      {sortField === 'severity' && (
                        sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      {sortField === 'title' && (
                        sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1">
                      Type
                      {sortField === 'type' && (
                        sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Element
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-bg-primary divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-bg-secondary cursor-pointer"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {issue.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {issue.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {issue.element}
                      </div>
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

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-bg-primary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{selectedIssue.title}</h2>
              <button
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                onClick={() => setSelectedIssue(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Severity
                </h3>
                <span className={`font-medium ${getSeverityColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Status
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedIssue.status)}`}>
                  {selectedIssue.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Description
                </h3>
                <p className="text-light-text-primary dark:text-dark-text-primary">
                  {selectedIssue.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Element
                </h3>
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                  {selectedIssue.element}
                </code>
              </div>
              {selectedIssue.codeSnippet && (
                <div>
                  <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Code Snippet
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                    {selectedIssue.codeSnippet}
                  </pre>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Recommendation
                </h3>
                <p className="text-light-text-primary dark:text-dark-text-primary">
                  {selectedIssue.recommendation}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  URL
                </h3>
                <a
                  href={selectedIssue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {selectedIssue.url}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues; 