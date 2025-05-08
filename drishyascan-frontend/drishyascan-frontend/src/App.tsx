import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'context/ThemeContext';
import { AuthProvider } from 'context/AuthContext';
import { MainLayout, AuthLayout } from 'components/layout';
import { ProtectedRoute } from 'components/auth/ProtectedRoute';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { ROUTES, ROUTE_TITLES } from 'routes/constants';
import { Project } from 'types/project';
import { Website } from 'types/website';
import { projectApi, websiteApi } from 'services/api';

// Import page components
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import Dashboard from 'pages/dashboard/Dashboard';
import Projects from 'pages/projects/Projects';
import Websites from 'pages/websites/Websites';
import Scans from 'pages/scans/Scans';
import Issues from 'pages/issues/Issues';
import Reports from 'pages/reports/Reports';
import Settings from 'pages/settings/Settings';
import NotFound from 'pages/NotFound';

const App: React.FC = () => {
  // Fetch projects and websites
  const [projects, setProjects] = useState<Project[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [projectsData, websitesData] = await Promise.all([
          projectApi.getProjects(),
          websiteApi.getWebsites()
        ]);
        setProjects(projectsData);
        setWebsites(websitesData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route 
                path={ROUTES.LOGIN} 
                element={
                  <AuthLayout title={ROUTE_TITLES[ROUTES.LOGIN]}>
                    <Login />
                  </AuthLayout>
                } 
              />
              <Route 
                path={ROUTES.REGISTER} 
                element={
                  <AuthLayout title={ROUTE_TITLES[ROUTES.REGISTER]}>
                    <Register />
                  </AuthLayout>
                } 
              />

              {/* Protected Routes */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.DASHBOARD]}>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROJECTS}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.PROJECTS]}>
                      <Projects />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WEBSITES}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.WEBSITES]}>
                      <Websites />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SCANS}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.SCANS]}>
                      <Scans />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ISSUES}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.ISSUES]}>
                      <Issues />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.REPORTS}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.REPORTS]}>
                      <Reports />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <MainLayout title={ROUTE_TITLES[ROUTES.SETTINGS]}>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard or login */}
              <Route
                path={ROUTES.ROOT}
                element={<Navigate to={ROUTES.DASHBOARD} replace />}
              />

              {/* 404 route */}
              <Route
                path={ROUTES.NOT_FOUND}
                element={
                  <AuthLayout title={ROUTE_TITLES[ROUTES.NOT_FOUND]}>
                    <NotFound />
                  </AuthLayout>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 