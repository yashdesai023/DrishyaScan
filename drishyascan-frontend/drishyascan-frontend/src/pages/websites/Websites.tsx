import React, { useState, useEffect } from 'react';
import { PlusIcon, GlobeAltIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { websiteApi, projectApi } from 'services/api';
import { useAuth } from 'context/AuthContext';
import wsService from 'services/websocket';
import { Website } from 'types/website';

interface Project {
  id: string;
  name: string;
}

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { url: string; projectId: string }) => Promise<void>;
  initialData?: { url: string; projectId: string };
  mode: 'add' | 'edit';
}

const ITEMS_PER_PAGE = 10;

const WebsiteModal: React.FC<WebsiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [url, setUrl] = useState(initialData?.url || '');
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (err: any) {
        setError('Failed to load projects');
      }
    };
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave({ url, projectId });
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} website`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-bg-primary rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New Website' : 'Edit Website'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Website URL</label>
            <input
              type="url"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <div>
            <label className="form-label">Project</label>
            <select
              className="form-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'add' ? 'Add Website' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Websites: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'url' | 'score' | 'lastScan'>('url');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const data = await websiteApi.getWebsites();
      setWebsites(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch websites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();

    // Connect to WebSocket
    wsService.connect();

    // Subscribe to scan updates
    const unsubscribe = wsService.onScanUpdate((update) => {
      setWebsites(prevWebsites => {
        return prevWebsites.map(website => {
          if (website.id === update.websiteId) {
            return {
              ...website,
              status: update.status === 'scanning' ? 'active' : 'inactive',
              lastScan: update.status === 'completed' ? {
                id: update.scanId,
                status: 'completed',
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString()
              } : website.lastScan,
              accessibilityScore: update.status === 'completed' ? update.progress || website.accessibilityScore : website.accessibilityScore
            };
          }
          return website;
        });
      });

      // Show error message if scan failed
      if (update.status === 'failed' && update.error) {
        setError(`Scan failed for website: ${update.error}`);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    let result = [...websites];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(website =>
        website.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(website => website.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'url':
          comparison = a.url.localeCompare(b.url);
          break;
        case 'score':
          comparison = (a.accessibilityScore || 0) - (b.accessibilityScore || 0);
          break;
        case 'lastScan':
          const aTime = a.lastScan?.startTime ? new Date(a.lastScan.startTime).getTime() : 0;
          const bTime = b.lastScan?.startTime ? new Date(b.lastScan.startTime).getTime() : 0;
          comparison = aTime - bTime;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredWebsites(result);
    setCurrentPage(1);
  }, [websites, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredWebsites.length / ITEMS_PER_PAGE);
  const paginatedWebsites = filteredWebsites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: 'url' | 'score' | 'lastScan') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSaveWebsite = async (data: { url: string; projectId: string }) => {
    if (editingWebsite) {
      await websiteApi.updateWebsite(editingWebsite.id, data);
    } else {
      await websiteApi.createWebsite(data);
    }
    await fetchWebsites();
  };

  const handleEditClick = (website: Website) => {
    setEditingWebsite(website);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingWebsite(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingWebsite(null);
  };

  const handleDeleteWebsite = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await websiteApi.deleteWebsite(id);
        await fetchWebsites();
      } catch (err: any) {
        setError(err.message || 'Failed to delete website');
      }
    }
  };

  const handleStartScan = async (websiteId: string) => {
    try {
      await websiteApi.startScan(websiteId);
      await fetchWebsites();
    } catch (err: any) {
      setError(err.message || 'Failed to start scan');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Websites</h1>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={handleAddClick}
        >
          <PlusIcon className="w-5 h-5" />
          Add Website
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search websites..."
            className="form-input w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Sort by:</span>
          <select
            className="form-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'url' | 'score' | 'lastScan');
              setSortOrder(order as 'asc' | 'desc');
            }}
          >
            <option value="url-asc">URL (A-Z)</option>
            <option value="url-desc">URL (Z-A)</option>
            <option value="score-asc">Score (Low-High)</option>
            <option value="score-desc">Score (High-Low)</option>
            <option value="lastScan-desc">Last Scan (Newest)</option>
            <option value="lastScan-asc">Last Scan (Oldest)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div className="card text-center py-12">
          <GlobeAltIcon className="w-12 h-12 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
          <h3 className="text-lg font-medium mb-2">No Websites Found</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first website to start scanning for accessibility issues'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              className="btn-primary"
              onClick={handleAddClick}
            >
              Add Website
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {paginatedWebsites.map((website) => (
              <div key={website.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{website.url}</h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                      Project ID: {website.projectId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(website.accessibilityScore || 0)}`}>
                      {website.accessibilityScore}%
                    </span>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Accessibility Score
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    Last scan: {new Date(website.lastScan?.startTime || '').toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded ${
                      website.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {website.status}
                    </span>
                    <button
                      className={`btn-secondary ${website.status === 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleStartScan(website.id)}
                      disabled={website.status === 'active'}
                    >
                      {website.status === 'active' ? 'Scanning...' : 'Scan'}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditClick(website)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteWebsite(website.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <WebsiteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveWebsite}
        initialData={editingWebsite ? { url: editingWebsite.url, projectId: editingWebsite.projectId } : undefined}
        mode={editingWebsite ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Websites; 