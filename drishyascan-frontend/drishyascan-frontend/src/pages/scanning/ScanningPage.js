import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  BugReport as BugReportIcon,
  Description as DescriptionIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const ScanningPage = () => {
  const { projectId, websiteId } = useParams();
  const navigate = useNavigate();

  // Dummy Data
  const dummyProject = {
    id: parseInt(projectId),
    name: `Project ${projectId}`,
  };

  const dummyWebsite = {
    id: parseInt(websiteId),
    name: 'Example Website',
    url: 'https://www.example.com',
    status: 'Active',
    lastScanDate: '2023-10-25T11:00:00Z',
    lastScanScore: 88,
    lastScanPages: 150,
    lastScanIssues: 25,
  };

  const dummyScanHistory = [
    { id: 1, date: '2023-10-25', pages: 150, score: 88, status: 'Completed' },
    { id: 2, date: '2023-10-18', pages: 145, score: 85, status: 'Completed' },
    { id: 3, date: '2023-10-10', pages: 140, score: 80, status: 'Completed' },
  ];

  const dummyScoreTrend = [
    { date: '2023-10-10', score: 80 },
    { date: '2023-10-18', score: 85 },
    { date: '2023-10-25', score: 88 },
  ];

  // State Management
  const [scanConfig, setScanConfig] = useState({
    url: dummyWebsite.url,
    scanDepth: 3,
    includeSubdomains: false,
    scheduledScan: false,
    recurrence: 'none',
    startTime: '',
    tags: '',
  });

  const [scanStatus, setScanStatus] = useState('idle'); // idle, in-progress, completed, failed
  const [scanProgress, setScanProgress] = useState({
    pagesCrawled: 0,
    totalPages: 100,
    elementsAnalyzed: 0,
    estimatedTimeLeft: '5 minutes',
  });

  const [scanResults, setScanResults] = useState({
    completionTime: null,
    totalPages: 0,
    score: 0,
    issues: {
      critical: 0,
      major: 0,
      minor: 0,
      info: 0,
    },
  });

  const getScoreColor = (score) => {
    if (score === null) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const handleStartScan = () => {
    setScanStatus('in-progress');
    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress({
        pagesCrawled: progress,
        totalPages: 100,
        elementsAnalyzed: progress * 100,
        estimatedTimeLeft: `${Math.max(0, 5 - Math.floor(progress / 20))} minutes`,
      });
      if (progress >= 100) {
        clearInterval(interval);
        setScanStatus('completed');
        setScanResults({
          completionTime: new Date().toISOString(),
          totalPages: 100,
          score: 88,
          issues: {
            critical: 2,
            major: 5,
            minor: 10,
            info: 8,
          },
        });
      }
    }, 1000);
  };

  const handleStopScan = () => {
    setScanStatus('failed');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/user" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to={`/user/projects/${projectId}`} color="inherit">
            {dummyProject.name}
          </Link>
          <Link component={RouterLink} to={`/user/projects/${projectId}/websites`} color="inherit">
            Websites
          </Link>
          <Link component={RouterLink} to={`/user/projects/${projectId}/websites/${websiteId}`} color="inherit">
            {dummyWebsite.name}
          </Link>
          <Typography color="text.primary">Scan</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Scan Website
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Website Info Summary Panel */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Website Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  {dummyWebsite.name}
                  <Chip
                    label={dummyWebsite.status}
                    color={dummyWebsite.status === 'Active' ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  URL: <Link href={dummyWebsite.url} target="_blank" rel="noopener noreferrer">
                    {dummyWebsite.url} <LaunchIcon fontSize="small" />
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  Last Scan: {new Date(dummyWebsite.lastScanDate).toLocaleDateString()}
                  <Chip
                    label={`${dummyWebsite.lastScanScore}%`}
                    color={getScoreColor(dummyWebsite.lastScanScore)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2">
                  Pages Scanned: {dummyWebsite.lastScanPages} | Issues Found: {dummyWebsite.lastScanIssues}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Scan Configuration Panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan Configuration</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website URL"
                  value={scanConfig.url}
                  onChange={(e) => setScanConfig({ ...scanConfig, url: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Scan Depth</InputLabel>
                  <Select
                    value={scanConfig.scanDepth}
                    label="Scan Depth"
                    onChange={(e) => setScanConfig({ ...scanConfig, scanDepth: e.target.value })}
                  >
                    <MenuItem value={1}>Level 1 (Homepage Only)</MenuItem>
                    <MenuItem value={2}>Level 2 (Homepage + Direct Links)</MenuItem>
                    <MenuItem value={3}>Level 3 (Standard)</MenuItem>
                    <MenuItem value={4}>Level 4 (Deep)</MenuItem>
                    <MenuItem value={5}>Level 5 (Comprehensive)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scanConfig.includeSubdomains}
                      onChange={(e) => setScanConfig({ ...scanConfig, includeSubdomains: e.target.checked })}
                    />
                  }
                  label="Include Subdomains"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scanConfig.scheduledScan}
                      onChange={(e) => setScanConfig({ ...scanConfig, scheduledScan: e.target.checked })}
                    />
                  }
                  label="Schedule Scan"
                />
              </Grid>
              {scanConfig.scheduledScan && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Recurrence</InputLabel>
                      <Select
                        value={scanConfig.recurrence}
                        label="Recurrence"
                        onChange={(e) => setScanConfig({ ...scanConfig, recurrence: e.target.value })}
                      >
                        <MenuItem value="none">One-time</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Start Time"
                      value={scanConfig.startTime}
                      onChange={(e) => setScanConfig({ ...scanConfig, startTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scan Tags"
                  placeholder="Add tags for report categorization (optional)"
                  value={scanConfig.tags}
                  onChange={(e) => setScanConfig({ ...scanConfig, tags: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartScan}
                  disabled={scanStatus === 'in-progress'}
                  fullWidth
                >
                  Start Scan
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Scan Status Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan Status</Typography>
            <Divider sx={{ mb: 2 }} />
            {scanStatus === 'idle' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No scan has been run for this website yet.
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Start your first scan to check accessibility compliance.
                </Typography>
              </Box>
            )}
            {scanStatus === 'in-progress' && (
              <Box>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Scanning in progress...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pages Crawled: {scanProgress.pagesCrawled} of {scanProgress.totalPages}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Elements Analyzed: {scanProgress.elementsAnalyzed}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Estimated Time Left: {scanProgress.estimatedTimeLeft}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleStopScan}
                  sx={{ mt: 2 }}
                >
                  Stop Scan
                </Button>
              </Box>
            )}
            {scanStatus === 'completed' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Scan Completed
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Completion Time: {new Date(scanResults.completionTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Total Pages Scanned: {scanResults.totalPages}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Overall Score: 
                  <Chip
                    label={`${scanResults.score}%`}
                    color={getScoreColor(scanResults.score)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Issue Breakdown:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="error">
                      Critical: {scanResults.issues.critical}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="warning.main">
                      Major: {scanResults.issues.major}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="info.main">
                      Minor: {scanResults.issues.minor}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Info: {scanResults.issues.info}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<BugReportIcon />}
                    component={RouterLink}
                    to={`/user/projects/${projectId}/websites/${websiteId}/issues`}
                  >
                    View Issues
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                  >
                    Generate Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BarChartIcon />}
                  >
                    View Summary
                  </Button>
                </Box>
              </Box>
            )}
            {scanStatus === 'failed' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Scan Failed
                </Typography>
                <Typography variant="body2">
                  The scan encountered an error. Please try again or contact support if the issue persists.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleStartScan}
                  sx={{ mt: 2 }}
                >
                  Retry Scan
                </Button>
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Scan History Table */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan History</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Scan Date</TableCell>
                    <TableCell>Pages Scanned</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dummyScanHistory.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>{new Date(scan.date).toLocaleDateString()}</TableCell>
                      <TableCell>{scan.pages}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${scan.score}%`}
                          color={getScoreColor(scan.score)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{scan.status}</TableCell>
                      <TableCell>
                        <Tooltip title="View Issues">
                          <IconButton size="small">
                            <BugReportIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Report">
                          <IconButton size="small">
                            <DescriptionIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Accessibility Score Trend */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Accessibility Score Trend</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyScoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: '#2563EB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScanningPage; 