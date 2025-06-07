import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
  CardActions,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FileDownload as FileDownloadIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const IssuesListPage = () => {
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
    lastScanDate: '2023-10-25T11:00:00Z',
    lastScanPages: 150,
    totalIssues: 25,
  };

  const dummyIssues = [
    {
      id: 1,
      title: 'Missing alt text on images',
      description: 'Images without alt text are not accessible to screen readers',
      severity: 'critical',
      wcagRef: '1.1.1',
      pageUrl: 'https://www.example.com/products/item1',
      status: 'open',
      date: '2023-10-25',
      comments: 2,
      assignedTo: 'John Doe',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Insufficient color contrast',
      description: 'Text color does not provide sufficient contrast with background',
      severity: 'major',
      wcagRef: '1.4.3',
      pageUrl: 'https://www.example.com/about',
      status: 'in-progress',
      date: '2023-10-25',
      comments: 0,
      assignedTo: null,
      priority: 'medium',
    },
    // Add more dummy issues as needed
  ];

  // State Management
  const [viewMode, setViewMode] = useState('table');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [filters, setFilters] = useState({
    severity: [],
    status: [],
    wcagCriteria: '',
    pageUrl: '',
    dateRange: [null, null],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('severity');
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter Options
  const severityOptions = ['critical', 'major', 'minor', 'info'];
  const statusOptions = ['open', 'in-progress', 'fixed', 'false-positive'];
  const wcagOptions = ['1.1.1', '1.4.3', '2.1.1', '2.4.4', '3.3.2'];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'major': return 'warning';
      case 'minor': return 'info';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in-progress': return 'warning';
      case 'fixed': return 'success';
      case 'false-positive': return 'default';
      default: return 'default';
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleIssueSelect = (issueId) => {
    setSelectedIssues(prev => {
      if (prev.includes(issueId)) {
        return prev.filter(id => id !== issueId);
      }
      return [...prev, issueId];
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIssues(dummyIssues.map(issue => issue.id));
    } else {
      setSelectedIssues([]);
    };
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions
    console.log(`Bulk action ${action} on issues:`, selectedIssues);
    setSelectedIssues([]);
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
          <Typography color="text.primary">Issues</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Accessibility Issues
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={`Scan Date: ${new Date(dummyWebsite.lastScanDate).toLocaleDateString()}`}
              variant="outlined"
            />
            <Chip
              label={`Pages: ${dummyWebsite.lastScanPages}`}
              variant="outlined"
            />
            <Chip
              label={`Issues: ${dummyWebsite.totalIssues}`}
              color="error"
            />
          </Box>
        </Box>
      </Box>

      {/* Toolbar / Filters Panel */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton value="table">
                  <Tooltip title="Table View">
                    <ViewListIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="card">
                  <Tooltip title="Card View">
                    <ViewModuleIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Expanded Filters */}
        {showFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    multiple
                    value={filters.severity}
                    label="Severity"
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {severityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Checkbox checked={filters.severity.includes(option)} />
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Checkbox checked={filters.status.includes(option)} />
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>WCAG Criteria</InputLabel>
                  <Select
                    value={filters.wcagCriteria}
                    label="WCAG Criteria"
                    onChange={(e) => setFilters({ ...filters, wcagCriteria: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    {wcagOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Page URL Contains"
                  value={filters.pageUrl}
                  onChange={(e) => setFilters({ ...filters, pageUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setFilters({
                      severity: [],
                      status: [],
                      wcagCriteria: '',
                      pageUrl: '',
                      dateRange: [null, null],
                    })}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Bulk Actions Panel */}
      {selectedIssues.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1">
              {selectedIssues.length} issues selected
            </Typography>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleBulkAction('mark-fixed')}
            >
              Mark as Fixed
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => handleBulkAction('mark-false-positive')}
            >
              Mark as False Positive
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      )}

      {/* Issues Display */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIssues.length === dummyIssues.length}
                    indeterminate={selectedIssues.length > 0 && selectedIssues.length < dummyIssues.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>WCAG</TableCell>
                <TableCell>Page URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIssues.includes(issue.id)}
                      onChange={() => handleIssueSelect(issue.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{issue.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {issue.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.severity}
                      color={getSeverityColor(issue.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{issue.wcagRef}</TableCell>
                  <TableCell>
                    <Tooltip title={issue.pageUrl}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {issue.pageUrl}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.status}
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{issue.date}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <BugReportIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {issue.comments > 0 && (
                      <Tooltip title={`${issue.comments} comments`}>
                        <IconButton size="small">
                          <CommentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {dummyIssues.map((issue) => (
            <Grid item xs={12} md={6} lg={4} key={issue.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {issue.title}
                    </Typography>
                    <Chip
                      label={issue.severity}
                      color={getSeverityColor(issue.severity)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {issue.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      label={`WCAG ${issue.wcagRef}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={issue.status}
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <Tooltip title={issue.pageUrl}>
                      <span>{issue.pageUrl}</span>
                    </Tooltip>
                  </Typography>
                  {issue.assignedTo && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon fontSize="small" />
                      {issue.assignedTo}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<BugReportIcon />}>
                    View Details
                  </Button>
                  {issue.comments > 0 && (
                    <Button size="small" startIcon={<CommentIcon />}>
                      {issue.comments} Comments
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {dummyIssues.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No accessibility issues found for this scan.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try scanning again or check filter settings.
          </Typography>
        </Paper>
      )}

      {/* Analytics Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Analytics</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>Total Issues</Typography>
            <Typography variant="h4">{dummyWebsite.totalIssues}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>By Severity</Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2">Critical</Typography>
                <LinearProgress variant="determinate" value={40} color="error" />
              </Box>
              <Box>
                <Typography variant="body2">Major</Typography>
                <LinearProgress variant="determinate" value={30} color="warning" />
              </Box>
              <Box>
                <Typography variant="body2">Minor</Typography>
                <LinearProgress variant="determinate" value={20} color="info" />
              </Box>
              <Box>
                <Typography variant="body2">Info</Typography>
                <LinearProgress variant="determinate" value={10} />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>By Status</Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2">Open</Typography>
                <LinearProgress variant="determinate" value={60} color="error" />
              </Box>
              <Box>
                <Typography variant="body2">In Progress</Typography>
                <LinearProgress variant="determinate" value={20} color="warning" />
              </Box>
              <Box>
                <Typography variant="body2">Fixed</Typography>
                <LinearProgress variant="determinate" value={15} color="success" />
              </Box>
              <Box>
                <Typography variant="body2">False Positive</Typography>
                <LinearProgress variant="determinate" value={5} />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>Top WCAG Violations</Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2">1.4.3 Contrast</Typography>
                <LinearProgress variant="determinate" value={35} />
              </Box>
              <Box>
                <Typography variant="body2">1.1.1 Alt Text</Typography>
                <LinearProgress variant="determinate" value={25} />
              </Box>
              <Box>
                <Typography variant="body2">2.1.1 Keyboard</Typography>
                <LinearProgress variant="determinate" value={20} />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default IssuesListPage; 