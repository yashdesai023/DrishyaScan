import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';
import ProtectedLayout from './components/layout/ProtectedLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectManagementPage from './pages/ProjectManagementPage';
import WebsiteManagementPage from './pages/WebsiteManagementPage';
import WebsiteDetailPage from './pages/WebsiteDetailPage';
import ScanningPage from './pages/scanning/ScanningPage';
import IssuesListPage from './pages/issues/IssuesListPage';
import Report from './pages/Report';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location, message: 'Please login to access this page' }} replace />;
  }

  return children;
};

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
          primary: {
            main: '#2563EB',
          },
          secondary: {
                  main: '#7C3AED', // Accent Purple
                },
                success: {
                  main: '#10B981',
                },
                warning: {
                  main: '#F59E0B',
                },
                error: {
                  main: '#EF4444',
                },
                background: {
                  default: '#FFFFFF', // Pure White
                  paper: '#F9FAFB', // Soft Light Grey
                },
                text: {
                  primary: '#111827', // Dark Charcoal
                  secondary: '#6B7280', // Muted Gray
                },
                divider: '#E5E7EB', // Borders
              }
            : {
                // Dark mode palette
                primary: {
                  main: '#3B82F6', // Lighter Blue for dark mode button primary
                },
                secondary: {
                  main: '#7C3AED', // Accent Purple
                },
                success: {
                  main: '#10B981',
                },
                warning: {
                  main: '#F59E0B',
                },
                error: {
                  main: '#EF4444',
          },
          background: {
                  default: '#0F172A', // Deep Navy
                  paper: '#1E293B', // Dark Blue-Grey
          },
          text: {
                  primary: '#F1F5F9', // Almost White
                  secondary: '#94A3B8', // Soft Gray-Blue
          },
                divider: '#334155', // Subtle Borders
              }),
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode],
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
            <Routes>
          {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

          {/* Routes with layout */}
          <Route path="/" element={<Layout onThemeToggle={toggleTheme} isDarkMode={mode === 'dark'}> 
            <Routes>
              <Route index element={<LandingPage />} />
            </Routes>
          </Layout>} />

          {/* Protected routes with protected layout */}
              <Route
            path="/user/*"
                element={
                  <ProtectedRoute>
                <ProtectedLayout onThemeToggle={toggleTheme} isDarkMode={mode === 'dark'}>
                  <Routes>
                    <Route index element={<Navigate to="/user/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<ProjectManagementPage />} />
                    <Route path="projects/:projectId/websites" element={<WebsiteManagementPage />} />
                    <Route path="websites" element={<WebsiteManagementPage />} />
                    <Route path="projects/:projectId/websites/:websiteId" element={<WebsiteDetailPage />} />
                    <Route path="projects/:projectId/websites/:websiteId/scan" element={<ScanningPage />} />
                    <Route path="projects/:projectId/websites/:websiteId/issues" element={<IssuesListPage />} />
                    <Route path="projects/:projectId/reports" element={<Report />} />
                    <Route path="scans" element={<ScanningPage />}/>
                    <Route path="issues" element={<IssuesListPage />} />
                    <Route path="reports" element={<Report />} />
                    <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
                    <Route path="*" element={<div>Page Not Found</div>} />
                  </Routes>
                </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;
