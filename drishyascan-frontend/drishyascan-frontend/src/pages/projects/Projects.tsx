import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  websiteCount: number;
  lastScan: string;
  status: 'active' | 'archived';
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Create your first project to start scanning websites
          </p>
          <button className="btn-primary">Create Project</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    {project.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <span>{project.websiteCount} websites</span>
                <span>Last scan: {project.lastScan}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects; 