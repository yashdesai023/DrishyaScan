import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Chip,
    Breadcrumbs,
    Link,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    PlayArrow as PlayArrowIcon,
    Assessment as AssessmentIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AccessibilityTrendChart from './AccessibilityTrendChart';
import IssueDistributionChart from './IssueDistributionChart';

const MetricCard = ({ title, value, icon, trend, color, loading }) => {
    const theme = useTheme();
    const isPositive = trend > 0;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        {loading ? (
                            <LinearProgress sx={{ width: '60%', mt: 1 }} />
                        ) : (
                            <Typography variant="h4" component="div">
                                {value}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: `${color}15`,
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
                {trend !== undefined && !loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isPositive ? (
                            <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                            <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: 16 }} />
                        )}
                        <Typography
                            variant="body2"
                            sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                        >
                            {Math.abs(trend)}% this week
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    // Using dummy data for demonstration purposes
    const [dashboardData] = useState({
        metrics: {
            totalProjects: 5,
            websitesScanned: 18,
            issuesDetected: 42,
            accessibilityScore: 87,
            criticalIssues: 3,
        },
        recentScans: [
            {
                id: 1,
                websiteName: 'drishyascan.com',
                scanDate: new Date().toISOString(),
                pagesScanned: 12,
                accessibilityScore: 92,
                status: 'completed',
            },
            {
                id: 2,
                websiteName: 'gov-access.org',
                scanDate: new Date(Date.now() - 86400000).toISOString(),
                pagesScanned: 8,
                accessibilityScore: 78,
                status: 'completed',
            },
            {
                id: 3,
                websiteName: 'mysite.net',
                scanDate: new Date(Date.now() - 2 * 86400000).toISOString(),
                pagesScanned: 15,
                accessibilityScore: 65,
                status: 'failed',
            },
            {
                id: 4,
                websiteName: 'example.com',
                scanDate: new Date(Date.now() - 3 * 86400000).toISOString(),
                pagesScanned: 10,
                accessibilityScore: 88,
                status: 'completed',
            },
            {
                id: 5,
                websiteName: 'university.edu',
                scanDate: new Date(Date.now() - 4 * 86400000).toISOString(),
                pagesScanned: 20,
                accessibilityScore: 80,
                status: 'in_progress',
            },
        ],
        trendData: [
            { date: new Date(Date.now() - 6 * 86400000), score: 70 },
            { date: new Date(Date.now() - 5 * 86400000), score: 75 },
            { date: new Date(Date.now() - 4 * 86400000), score: 80 },
            { date: new Date(Date.now() - 3 * 86400000), score: 85 },
            { date: new Date(Date.now() - 2 * 86400000), score: 83 },
            { date: new Date(Date.now() - 86400000), score: 88 },
            { date: new Date(), score: 87 },
        ],
        issueDistribution: {
            critical: 3,
            major: 12,
            minor: 20,
            info: 7,
        },
        problematicWebsites: [
            {
                id: 1,
                name: 'mysite.net',
                lastScan: new Date(Date.now() - 2 * 86400000).toISOString(),
                score: 65,
                issues: 18,
                lastScanId: 3,
            },
            {
                id: 2,
                name: 'gov-access.org',
                lastScan: new Date(Date.now() - 86400000).toISOString(),
                score: 78,
                issues: 12,
                lastScanId: 2,
            },
            {
                id: 3,
                name: 'university.edu',
                lastScan: new Date(Date.now() - 4 * 86400000).toISOString(),
                score: 80,
                issues: 10,
                lastScanId: 5,
            },
        ],
    });

    const loading = false; // Hardcode loading to false
    const error = null;    // Hardcode error to null

    // Removed useEffect and fetchDashboardData to ensure no API calls are made

    const getStatusChip = (status) => {
        const statusConfig = {
            completed: { color: 'success', icon: <CheckCircleIcon /> },
            failed: { color: 'error', icon: <ErrorIcon /> },
            in_progress: { color: 'warning', icon: <WarningIcon /> },
        };

        const config = statusConfig[status] || statusConfig.completed;

        return (
            <Chip
                icon={config.icon}
                label={status.replace('_', ' ').toUpperCase()}
                color={config.color}
                size="small"
            />
        );
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'success.main';
        if (score >= 70) return 'warning.main';
        return 'error.main';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Error and Loading Handlers (now effectively bypassed for dummy data) */}
            {error && (
                <Box sx={{ mb: 3 }}>
                    <Card sx={{ bgcolor: 'error.main', color: 'error.contrastText', p: 2 }}>
                        <Typography variant="h6">{error}</Typography>
                    </Card>
                </Box>
            )}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <LinearProgress sx={{ width: '100%' }} />
                </Box>
            )}
            {!loading && !error && (
                <React.Fragment>
                    {/* Page Header */}
                    <Box sx={{ mb: 4 }}>
                        <Breadcrumbs sx={{ mb: 2 }}>
                            <Link component={RouterLink} to="/user" color="inherit">
                                Home
                            </Link>
                            <Typography color="text.primary">Dashboard</Typography>
                        </Breadcrumbs>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h1">
                                Dashboard
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    component={RouterLink}
                                    to="/user/projects/new"
                                >
                                    New Project
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<PlayArrowIcon />}
                                    component={RouterLink}
                                    to="/user/scans/new"
                                >
                                    Start Scan
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AssessmentIcon />}
                                    component={RouterLink}
                                    to="/user/reports"
                                >
                                    Generate Report
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Total Projects"
                                value={dashboardData.metrics.totalProjects}
                                icon={<AddIcon sx={{ color: 'primary.main' }} />}
                                trend={5}
                                color="#2563eb"
                                loading={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Websites Scanned"
                                value={dashboardData.metrics.websitesScanned}
                                icon={<PlayArrowIcon sx={{ color: 'info.main' }} />}
                                trend={12}
                                color="#0284c7"
                                loading={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Issues Detected"
                                value={dashboardData.metrics.issuesDetected}
                                icon={<WarningIcon sx={{ color: 'warning.main' }} />}
                                trend={-8}
                                color="#eab308"
                                loading={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Accessibility Score"
                                value={`${dashboardData.metrics.accessibilityScore}%`}
                                icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                                trend={3}
                                color="#22c55e"
                                loading={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <MetricCard
                                title="Critical Issues"
                                value={dashboardData.metrics.criticalIssues}
                                icon={<ErrorIcon sx={{ color: 'error.main' }} />}
                                trend={-15}
                                color="#ef4444"
                                loading={loading}
                            />
                        </Grid>
                    </Grid>

                    {/* Charts Section */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Accessibility Score Trend
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <AccessibilityTrendChart data={dashboardData.trendData} loading={loading} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Issue Distribution
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <IssueDistributionChart data={dashboardData.issueDistribution} loading={loading} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Recent Activity Table */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Recent Activity</Typography>
                                <Button
                                    component={RouterLink}
                                    to="/user/reports"
                                    endIcon={<VisibilityIcon />}
                                >
                                    View All
                                </Button>
                            </Box>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Website Name</TableCell>
                                            <TableCell>Scan Date</TableCell>
                                            <TableCell>Pages Scanned</TableCell>
                                            <TableCell>Accessibility Score</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <LinearProgress />
                                                </TableCell>
                                            </TableRow>
                                        ) : dashboardData.recentScans.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No recent scans found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            dashboardData.recentScans.map((scan) => (
                                                <TableRow key={scan.id}>
                                                    <TableCell>{scan.websiteName}</TableCell>
                                                    <TableCell>{new Date(scan.scanDate).toLocaleString()}</TableCell>
                                                    <TableCell>{scan.pagesScanned}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: getScoreColor(scan.accessibilityScore) }}
                                                            >
                                                                {scan.accessibilityScore}%
                                                            </Typography>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={scan.accessibilityScore}
                                                                sx={{
                                                                    width: 60,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    backgroundColor: `${getScoreColor(scan.accessibilityScore)}20`,
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: getScoreColor(scan.accessibilityScore),
                                                                    },
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{getStatusChip(scan.status)}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            component={RouterLink}
                                                            to={`/user/scans/${scan.id}`}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Top Problematic Websites */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Problematic Websites
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Website Name</TableCell>
                                            <TableCell>Last Scan</TableCell>
                                            <TableCell>Score</TableCell>
                                            <TableCell>Issues</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <LinearProgress />
                                                </TableCell>
                                            </TableRow>
                                        ) : dashboardData.problematicWebsites.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    No problematic websites found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            dashboardData.problematicWebsites.map((website) => (
                                                <TableRow key={website.id}>
                                                    <TableCell>{website.name}</TableCell>
                                                    <TableCell>{new Date(website.lastScan).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: getScoreColor(website.score) }}
                                                        >
                                                            {website.score}%
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{website.issues}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            component={RouterLink}
                                                            to={`/user/scans/${website.lastScanId}`}
                                                        >
                                                            View Issues
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </React.Fragment>
            )}
        </Box>
    );
};

export default Dashboard; 