import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout, AuthLayout } from './components/layout';

// Import your page components (create placeholder components for now)
// You'll replace these with actual implementations later
const Dashboard = () => (
  <section className="card mb-6">
    <h2 className="text-xl font-semibold mb-4">Welcome to DrishyaScan</h2>
    <p className="text-light-text-secondary dark:text-dark-text-secondary">
      Your Web Accessibility Analyzer Tool
    </p>
    <button className="btn-primary mt-4">Get Started</button>
  </section>
);

const Features = () => (
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
);

// Placeholder components for other pages
const Projects = () => <div>Projects Page</div>;
const Websites = () => <div>Websites Page</div>;
const Scans = () => <div>Scans Page</div>;
const Issues = () => <div>Issues Page</div>;
const Reports = () => <div>Reports Page</div>;
const Settings = () => <div>Settings Page</div>;
const Login = () => <div>Login Form</div>;
const Register = () => <div>Register Form</div>;
const NotFound = () => <div>Page Not Found</div>;

// Sample HomePage that combines your existing content
const HomePage = () => (
  <>
    <Dashboard />
    <Features />
  </>
);

function App() {
  // You would implement actual auth state management here
  const isAuthenticated = true; // Example: replace with actual auth state

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthLayout title="Sign In">
                  <Login />
                </AuthLayout>
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthLayout title="Create Account">
                  <Register />
                </AuthLayout>
              )
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <MainLayout title="Dashboard">
                  <HomePage />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/projects"
            element={
              isAuthenticated ? (
                <MainLayout title="Projects">
                  <Projects />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/websites"
            element={
              isAuthenticated ? (
                <MainLayout title="Websites">
                  <Websites />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/scans"
            element={
              isAuthenticated ? (
                <MainLayout title="Accessibility Scans">
                  <Scans />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/issues"
            element={
              isAuthenticated ? (
                <MainLayout title="Issues">
                  <Issues />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/reports"
            element={
              isAuthenticated ? (
                <MainLayout title="Reports">
                  <Reports />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <MainLayout title="Settings">
                  <Settings />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />

          {/* 404 route */}
          <Route
            path="*"
            element={
              <AuthLayout title="Page Not Found">
                <NotFound />
              </AuthLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;