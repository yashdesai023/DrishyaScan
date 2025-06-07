import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  ButtonGroup,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  GridView as GridViewIcon,
  TableChart as TableViewIcon,
  PictureAsPdf as PdfIcon,
  TableView as CsvIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import reportService from '../services/reportService';
import projectService from '../services/projectService';
import websiteService from '../services/websiteService';

const Report = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [project, setProject] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    reportType: 'all',
    format: 'all',
    dateRange: [null, null],
    generatedBy: 'all',
    search: '',
  });
  const [reportForm, setReportForm] = useState({
    websiteId: '',
    scanId: 'latest',
    reportType: 'summary',
    formats: ['PDF'],
    title: '',
  });

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectData, reportsData, websitesData] = await Promise.all([
        projectService.getProject(projectId),
        reportService.getProjectReports(projectId),
        projectService.getProjectWebsites(projectId),
      ]);
      setProject(projectData);
      setReports(reportsData);
      setWebsites(websitesData);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: 'Error loading data: ' + err.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await reportService.generateReport(projectId, reportForm);
      setSnackbar({
        open: true,
        message: 'Report generated successfully',
        severity: 'success',
      });
      setGenerateDialogOpen(false);
      fetchData(); // Refresh the reports list
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error generating report: ' + err.message,
        severity: 'error',
      });
    }
  };

  const handleViewReport = async (report) => {
    try {
      const reportData = await reportService.getReport(report.id);
      setSelectedReport(reportData);
      setPreviewDialogOpen(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error loading report: ' + err.message,
        severity: 'error',
      });
    }
  };

  const handleDownloadReport = async (report, format) => {
    try {
      const blob = await reportService.downloadReport(report.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error downloading report: ' + err.message,
        severity: 'error',
      });
    }
  };

  const handleDeleteReport = async (report) => {
    try {
      await reportService.deleteReport(report.id);
      setSnackbar({
        open: true,
        message: 'Report deleted successfully',
        severity: 'success',
      });
      fetchData(); // Refresh the reports list
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error deleting report: ' + err.message,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      {/* Page Header */}
      <Box className="mb-6">
        <Breadcrumbs className="mb-2">
          <Link to="/user/projects" className="text-blue-600 hover:text-blue-800">
            Projects
          </Link>
          <Link to={`/user/projects/${projectId}`} className="text-blue-600 hover:text-blue-800">
            {project?.name || 'Project'}
          </Link>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>
        
        <Box className="flex justify-between items-center">
          <Box>
            <Typography variant="h4" className="font-semibold mb-2">
              Accessibility Reports
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {reports.length} reports generated for {project?.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setGenerateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Generate New Report
          </Button>
        </Box>
      </Box>

      {/* Report Summary Panel */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="text.secondary">Total Reports</Typography>
              <Typography variant="h4">{reports.length}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="text.secondary">Reports by Type</Typography>
              <Typography variant="body1">5 Summary, 8 Detailed</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="text.secondary">Most Downloaded</Typography>
              <Typography variant="body1">Homepage Report</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" color="text.secondary">Latest Report</Typography>
              <Typography variant="body1">2024-03-20</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters and Toolbar */}
      <Box className="mb-6 bg-white rounded-lg shadow p-4">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
                label="Report Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="summary">Summary</MenuItem>
                <MenuItem value="detailed">Detailed</MenuItem>
                <MenuItem value="compliance">Compliance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Format</InputLabel>
              <Select
                value={filters.format}
                onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                label="Format"
              >
                <MenuItem value="all">All Formats</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filters.dateRange[0]}
                onChange={(date) => setFilters({ ...filters, dateRange: [date, filters.dateRange[1]] })}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={filters.dateRange[1]}
                onChange={(date) => setFilters({ ...filters, dateRange: [filters.dateRange[0], date] })}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* View Toggle */}
      <Box className="flex justify-end mb-4">
        <ButtonGroup>
          <IconButton
            onClick={() => setViewMode('table')}
            color={viewMode === 'table' ? 'primary' : 'default'}
          >
            <TableViewIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <GridViewIcon />
          </IconButton>
        </ButtonGroup>
      </Box>

      {/* Report List */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name / Type</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Date Generated</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Generated By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{report.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {report.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Link to={`/user/projects/${projectId}/websites/${report.website}`} className="text-blue-600 hover:text-blue-800">
                      {report.website}
                    </Link>
                  </TableCell>
                  <TableCell>{report.dateGenerated}</TableCell>
                  <TableCell>
                    <Box className="flex gap-2">
                      {report.format.map((format) => (
                        <Chip
                          key={format}
                          icon={format === 'PDF' ? <PdfIcon /> : <CsvIcon />}
                          label={format}
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{report.generatedBy}</TableCell>
                  <TableCell>
                    <Box className="flex gap-2">
                      <Tooltip title="View Report">
                        <IconButton size="small" onClick={() => handleViewReport(report)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton size="small" onClick={() => handleDownloadReport(report, report.format[0])}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Report">
                        <IconButton size="small" onClick={() => handleDeleteReport(report)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-2">{report.name}</Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    {report.type}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    Website: {report.website}
                  </Typography>
                  <Box className="flex gap-2 mb-2">
                    {report.format.map((format) => (
                      <Chip
                        key={format}
                        icon={format === 'PDF' ? <PdfIcon /> : <CsvIcon />}
                        label={format}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" className="block mb-2">
                    Generated on {report.dateGenerated} by {report.generatedBy}
                  </Typography>
                  <Box className="flex gap-2">
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewReport(report)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadReport(report, report.format[0])}
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Website</InputLabel>
                <Select
                  value={reportForm.websiteId}
                  onChange={(e) => setReportForm({ ...reportForm, websiteId: e.target.value })}
                  label="Select Website"
                >
                  {websites.map((website) => (
                    <MenuItem key={website.id} value={website.id}>
                      {website.url}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportForm.reportType}
                  onChange={(e) => setReportForm({ ...reportForm, reportType: e.target.value })}
                  label="Report Type"
                >
                  <MenuItem value="summary">Summary</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="compliance">Compliance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={reportForm.formats.includes('PDF')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...reportForm.formats, 'PDF']
                          : reportForm.formats.filter(f => f !== 'PDF');
                        setReportForm({ ...reportForm, formats });
                      }}
                    />
                  }
                  label="PDF Format"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={reportForm.formats.includes('CSV')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...reportForm.formats, 'CSV']
                          : reportForm.formats.filter(f => f !== 'CSV');
                        setReportForm({ ...reportForm, formats });
                      }}
                    />
                  }
                  label="CSV Format"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Title (Optional)"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                placeholder="Enter a custom title for the report"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={!reportForm.websiteId || reportForm.formats.length === 0}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedReport?.name}
          <Typography variant="subtitle2" color="text.secondary">
            {selectedReport?.type} Report
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Accessibility Score Summary</Typography>
                {/* Add score visualization here */}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Issue Breakdown</Typography>
                {/* Add issue breakdown here */}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">WCAG Compliance Checklist</Typography>
                {/* Add compliance checklist here */}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Recommendations</Typography>
                {/* Add recommendations here */}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => selectedReport && handleDownloadReport(selectedReport, 'PDF')}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => selectedReport && handleDownloadReport(selectedReport, 'CSV')}
          >
            Download CSV
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report; 