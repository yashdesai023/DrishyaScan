import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../routes/constants';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="btn-primary"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 