// src/components/layout/Header.jsx
import { useState } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../ThemeToggle';

const Header = ({ title = 'DrishyaScan' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              {/* You can replace this with your actual logo */}
              <span className="text-2xl font-bold text-primary">
                {title}
              </span>
            </div>
          </div>

          {/* Right side navigation items */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle using your ThemeToggle component */}
            <ThemeToggle />

            {/* Notifications */}
            <button
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300"
              aria-label="View notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Account</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <a
                    href="#signout"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;