// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  GlobeAltIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Websites', href: '/websites', icon: GlobeAltIcon },
    { name: 'Scans', href: '/scans', icon: DocumentMagnifyingGlassIcon },
    { name: 'Issues', href: '/issues', icon: ExclamationTriangleIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-sidebar"
        >
          <span className="sr-only">{isMobileOpen ? 'Close sidebar' : 'Open sidebar'}</span>
          {isMobileOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar for all screen sizes */}
      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-light-bg-primary dark:bg-dark-bg-primary border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary">
            DrishyaScan
          </span>
        </div>

        <nav className="mt-5 px-2 space-y-1" aria-label="Main Navigation">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  active
                    ? 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-primary'
                    : 'text-light-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className={`mr-4 h-6 w-6 ${
                    active
                      ? 'text-primary'
                      : 'text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;