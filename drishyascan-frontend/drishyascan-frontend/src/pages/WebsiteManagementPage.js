import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayArrowIcon,
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';

const WebsiteManagementPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Dummy Data for Project and Websites
  const dummyProject = {
    id: parseInt(projectId),
    name: `Project ${projectId}`,
  };

  const [websites, setWebsites] = useState([
    {
      id: 101,
      name: 'Homepage',
      url: 'https://example.com/home',
      lastScanDate: '2023-10-25T11:00:00Z',
      accessibilityScore: 90,
      status: 'Active',
    },
    {
      id: 102,
      name: 'Pricing Page',
      url: 'https://example.com/pricing',
      lastScanDate: '2023-10-20T09:00:00Z',
      accessibilityScore: 75,
      status: 'Active',
    },
    {
      id: 103,
      name: 'Blog Section',
      url: 'https://example.com/blog',
      lastScanDate: '2023-10-18T15:00:00Z',
      accessibilityScore: 60,
      status: 'Inactive',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState(null);
  const [websiteName, setWebsiteName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState('Active');

  const filteredWebsites = websites.filter((website) => {
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          website.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || website.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'Alphabetical') return a.name.localeCompare(b.name);
    if (sortBy === 'Recently Scanned') return new Date(b.lastScanDate) - new Date(a.lastScanDate);
    if (sortBy === 'Accessibility Score') return b.accessibilityScore - a.accessibilityScore;
    return 0;
  });

  const handleOpenAdd = () => {
    setCurrentWebsite(null);
    setWebsiteName('');
    setWebsiteURL('');
    setWebsiteStatus('Active');
    setOpenAddEditModal(true);
  };

  const handleOpenEdit = (website) => {
    setCurrentWebsite(website);
    setWebsiteName(website.name);
    setWebsiteURL(website.url);
    setWebsiteStatus(website.status);
    setOpenAddEditModal(true);
  };

  const handleSaveWebsite = () => {
    if (!websiteName.trim() || !websiteURL.trim()) return;

    if (currentWebsite) {
      setWebsites(websites.map(w => w.id === currentWebsite.id ? { ...w, name: websiteName, url: websiteURL, status: websiteStatus } : w));
    } else {
      const newWebsite = {
        id: websites.length ? Math.max(...websites.map(w => w.id)) + 1 : 1,
        name: websiteName,
        url: websiteURL,
        lastScanDate: null,
        accessibilityScore: null,
        status: websiteStatus,
      };
      setWebsites([...websites, newWebsite]);
    }
    setOpenAddEditModal(false);
  };

  const handleDeleteWebsite = (id) => {
    setWebsites(websites.filter(w => w.id !== id));
  };

  const getScoreColor = (score) => {
    if (score === null) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const renderWebsiteCard = (website) => (
    <Grid item xs={12} sm={6} md={4} key={website.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom>
              {website.name}
            </Typography>
            <Chip
              label={website.status}
              color={website.status === 'Active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            URL: <Link href={website.url} target="_blank" rel="noopener noreferrer">{website.url}</Link>
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Last Scan: {website.lastScanDate ? new Date(website.lastScanDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Accessibility Score: 
            {website.accessibilityScore !== null ? (
              <Chip label={`${website.accessibilityScore}%`} color={getScoreColor(website.accessibilityScore)} size="small" sx={{ ml: 1 }} />
            ) : (
              'N/A'
            )}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            component={RouterLink}
            to={`/user/projects/${projectId}/websites/${website.id}`}
            startIcon={<VisibilityIcon />}
          >
            View Details
          </Button>
          <IconButton size="small" onClick={() => console.log('Start Scan', website.id)}>
            <PlayArrowIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleOpenEdit(website)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteWebsite(website.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </Grid>
  );

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
          <Typography color="text.primary">Websites</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Manage Websites for {dummyProject.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Add New Website
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="Search websites by name or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon color="action" sx={{ mr: 1 }} />
            ),
          }}
          sx={{ mt: 3 }}
        />
      </Box>

      {/* Website Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="Alphabetical">Alphabetical</MenuItem>
            <MenuItem value="Recently Scanned">Recently Scanned</MenuItem>
            <MenuItem value="Accessibility Score">Accessibility Score</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Website List/Grid Section */}
      {filteredWebsites.length === 0 && (searchTerm !== '' || filterStatus !== 'All') ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="textSecondary">No matching websites found.</Typography>
        </Box>
      ) : filteredWebsites.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>No websites added to this project yet.</Typography>
          <Typography variant="body1" gutterBottom>Let's add your first website to start scanning!</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Add Website
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredWebsites.map(renderWebsiteCard)}
        </Grid>
      )}

      {/* Add/Edit Website Modal */}
      <Dialog open={openAddEditModal} onClose={() => setOpenAddEditModal(false)}>
        <DialogTitle>{currentWebsite ? 'Edit Website' : 'Add New Website'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Website Name"
            type="text"
            fullWidth
            variant="outlined"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Website URL"
            type="url"
            fullWidth
            variant="outlined"
            value={websiteURL}
            onChange={(e) => setWebsiteURL(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={websiteStatus}
              label="Status"
              onChange={(e) => setWebsiteStatus(e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEditModal(false)}>Cancel</Button>
          <Button onClick={handleSaveWebsite} variant="contained">{currentWebsite ? 'Save Changes' : 'Add Website'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WebsiteManagementPage;