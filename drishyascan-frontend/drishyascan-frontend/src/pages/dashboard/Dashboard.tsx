import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to DrishyaScan</h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Your Web Accessibility Analyzer Tool
        </p>
        <button className="btn-primary mt-4">Get Started</button>
      </section>

      <section className="section">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="font-medium">Scan Websites</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Analyze websites for accessibility issues
            </p>
          </div>
          <div className="card">
            <h3 className="font-medium">Track Progress</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Monitor improvements over time
            </p>
          </div>
          <div className="card">
            <h3 className="font-medium">Fix Issues</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Get detailed remediation guidance
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="card">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            No recent activity to show
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 