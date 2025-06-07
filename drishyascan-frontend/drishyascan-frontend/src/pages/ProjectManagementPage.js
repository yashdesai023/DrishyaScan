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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'DrishyaScan Main Site',
      description: 'Accessibility project for the main DrishyaScan website.',
      websitesCount: 5,
      lastActivity: '2023-10-26T10:00:00Z',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Client Portal Redesign',
      description: 'Audit and improve accessibility for the new client portal.',
      websitesCount: 3,
      lastActivity: '2023-09-15T14:30:00Z',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Internal Tools Accessibility',
      description: 'Ensure all internal tools meet WCAG 2.1 AA standards.',
      websitesCount: 10,
      lastActivity: '2023-08-01T09:00:00Z',
      status: 'Archived',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [openNewProjectModal, setOpenNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Date Created') return new Date(b.lastActivity) - new Date(a.lastActivity);
    return 0; // Default no sort
  });

  const handleCreateNewProject = () => {
    if (newProjectName.trim() === '') return;
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      description: newProjectDescription,
      websitesCount: 0,
      lastActivity: new Date().toISOString(),
      status: 'Active',
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDescription('');
    setOpenNewProjectModal(false);
  };

  const handleArchiveProject = (id) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: 'Archived' } : p));
  };

  const handleRestoreProject = (id) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: 'Active' } : p));
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const renderProjectCard = (project) => (
    <Grid item xs={12} sm={6} md={4} key={project.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom>
              {project.name}
            </Typography>
            <Chip
              label={project.status}
              color={project.status === 'Active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {project.description || 'No description.'}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Websites: {project.websitesCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last Activity: {new Date(project.lastActivity).toLocaleDateString()}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            component={RouterLink}
            to={`/user/projects/${project.id}`}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <IconButton size="small" onClick={() => console.log('Edit', project.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          {project.status === 'Active' ? (
            <IconButton size="small" onClick={() => handleArchiveProject(project.id)}>
              <ArchiveIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={() => handleRestoreProject(project.id)}>
              <RestoreIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => handleDeleteProject(project.id)}>
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
          <Typography color="text.primary">Projects</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewProjectModal(true)}
          >
            New Project
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="Search projects..."
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

      {/* Project Toolbar / Filters */}
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
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Date Created">Date Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Project List or Grid View */}
      {filteredProjects.length === 0 && (searchTerm !== '' || filterStatus !== 'All') ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="textSecondary">No matching projects found.</Typography>
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>You have no projects yet.</Typography>
          <Typography variant="body1" gutterBottom>Let's start by creating your first project.</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewProjectModal(true)}
          >
            Create First Project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map(renderProjectCard)}
        </Grid>
      )}

      {/* New Project Modal */}
      <Dialog open={openNewProjectModal} onClose={() => setOpenNewProjectModal(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewProjectModal(false)}>Cancel</Button>
          <Button onClick={handleCreateNewProject} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManagementPage; 