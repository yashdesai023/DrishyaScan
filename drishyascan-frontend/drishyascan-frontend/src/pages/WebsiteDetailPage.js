import React from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  BugReport as BugReportIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  Score as ScoreIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';

const WebsiteDetailPage = () => {
  const { projectId, websiteId } = useParams();
  const navigate = useNavigate();

  // Dummy Data for Project and Website
  const dummyProject = {
    id: parseInt(projectId),
    name: `Project ${projectId}`,
  };

  const dummyWebsite = {
    id: parseInt(websiteId),
    name: 'Example Website',
    url: 'https://www.example.com',
    description: 'This is a dummy website for testing purposes, showcasing various features and content types.',
    lastScanDate: '2023-10-25T11:00:00Z',
    accessibilityScore: 88,
    status: 'Active',
    scanHistory: [
      { id: 1, date: '2023-10-25', score: 88, issues: 15 },
      { id: 2, date: '2023-10-18', score: 85, issues: 20 },
      { id: 3, date: '2023-10-10', score: 80, issues: 25 },
    ],
  };

  const getScoreColor = (score) => {
    if (score === null) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
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
          <Typography color="text.primary">{dummyWebsite.name}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {dummyWebsite.name}
            </Typography>
            <Chip
              label={dummyWebsite.status}
              color={dummyWebsite.status === 'Active' ? 'success' : 'default'}
              size="medium"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<PlayArrowIcon />}>
              Scan Now
            </Button>
            <Button variant="outlined" startIcon={<BugReportIcon />}>
              View Issues
            </Button>
            <Button variant="outlined" startIcon={<DescriptionIcon />}>
              Generate Report
            </Button>
            <Button variant="outlined" startIcon={<EditIcon />}>
              Edit Website
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Website Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Website Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              <ListItem>
                <ListItemIcon><LinkIcon /></ListItemIcon>
                <ListItemText primary="URL" secondary={<Link href={dummyWebsite.url} target="_blank" rel="noopener noreferrer">{dummyWebsite.url} <LaunchIcon fontSize="small" /></Link>} />
              </ListItem>
              <ListItem>
                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                <ListItemText primary="Description" secondary={dummyWebsite.description} />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                <ListItemText primary="Last Scan Date" secondary={dummyWebsite.lastScanDate ? new Date(dummyWebsite.lastScanDate).toLocaleDateString() : 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemIcon><ScoreIcon /></ListItemIcon>
                <ListItemText
                  primary="Accessibility Score"
                  secondary={dummyWebsite.accessibilityScore !== null ? (
                    <Chip label={`${dummyWebsite.accessibilityScore}%`} color={getScoreColor(dummyWebsite.accessibilityScore)} size="small" />
                  ) : (
                    'N/A'
                  )}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Scan History */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan History</Typography>
            <Divider sx={{ mb: 2 }} />
            {dummyWebsite.scanHistory.length === 0 ? (
              <Typography color="textSecondary">No scan history available.</Typography>
            ) : (
              <List>
                {dummyWebsite.scanHistory.map((scan) => (
                  <ListItem key={scan.id} divider>
                    <ListItemText
                      primary={`Scanned on: ${new Date(scan.date).toLocaleDateString()}`}
                      secondary={`Score: ${scan.score}% | Issues: ${scan.issues}`}
                    />
                    <Chip label={`${scan.score}%`} color={getScoreColor(scan.score)} size="small" />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WebsiteDetailPage;