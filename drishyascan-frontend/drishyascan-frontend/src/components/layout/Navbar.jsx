import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#000000', // Black background
  color: '#ffffff', // White text
  transition: 'background-color 0.3s ease',
}));

const Logo = styled('img')({
  height: 40, // Adjust height as needed
  marginRight: 16,
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff', // White text for nav items
  fontWeight: theme.typography.fontWeightBold, // Bold font
  textTransform: 'none', // Keep original casing
  borderRadius: 20, // Rounded corners
  margin: theme.spacing(0, 1),
  transition: 'color 0.3s ease', // Smooth transition for hover
  '&:hover': {
    color: '#aaff00', // Neon green on hover
    backgroundColor: 'transparent', // Keep background transparent
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20, // Rounded corners
  marginLeft: theme.spacing(2),
  fontWeight: theme.typography.fontWeightBold, // Bold font
  textTransform: 'none', // Keep original casing
  transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transitions
}));

const sections = [
  { text: 'Overview', id: 'overview' },
  { text: 'Products', id: 'products' },
  { text: 'About', id: 'about' },
  { text: 'Service', id: 'service' },
  { text: 'Technologies', id: 'technologies' },
  { text: 'Leadership', id: 'leadership' },
  { text: 'Insights', id: 'insights' },
  { text: 'Contact', id: 'contact' },
];

function Navbar({ onThemeToggle, isDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation to determine if on landing page
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLandingPage = location.pathname === '/'; // Check if on landing page

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (id) => {
    // This will only work if the sections are on the same page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {sections.map((section) => (
        <NavButton
          key={section.id}
          onClick={() => handleScrollToSection(section.id)}
        >
          {section.text}
        </NavButton>
      ))}
      <IconButton color="inherit" onClick={onThemeToggle} sx={{ mx: 1 }}>
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      <ActionButton
        variant="outlined"
        color="inherit"
        onClick={() => handleNavigation('/login')}
      >
        Login
      </ActionButton>
      <ActionButton
        variant="contained"
        color="primary"
        onClick={() => handleNavigation('/register')}
      >
        Register
      </ActionButton>
    </Box>
  );

  const renderMobileNav = () => (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleMobileMenuToggle}
        sx={{ ml: 'auto' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: { backgroundColor: '#1a1a1a', color: '#ffffff', width: 250 },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {sections.map((section) => (
              <ListItem button key={section.id} onClick={() => handleScrollToSection(section.id)}>
                <ListItemText primary={section.text} primaryTypographyProps={{ fontWeight: theme.typography.fontWeightBold }} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1, bgcolor: '#aaff00' }} />
             <ListItem button onClick={onThemeToggle}>
                <ListItemIcon sx={{ color: '#aaff00' }}>
                     {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} primaryTypographyProps={{ fontWeight: theme.typography.fontWeightBold }} />
            </ListItem>
            <Divider sx={{ my: 1, bgcolor: '#aaff00' }} />
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: theme.typography.fontWeightBold }} />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemText primary="Register" primaryTypographyProps={{ fontWeight: theme.typography.fontWeightBold }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <StyledAppBar position="static" elevation={0}> {/* Set elevation to 0 for a flat look */}
      <Box component="div" sx={{ maxWidth: 'lg', width: '100%', margin: '0 auto' }}> {/* Use a Box for max width similar to Container */}
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Replace with actual logo img tag when available */}
            {/* <Logo src="/path/to/your/logo.png" alt="DrishyaScan Logo" /> */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                mr: 2,
                fontWeight: theme.typography.fontWeightBold, // Bold font
                color: 'inherit', // Inherit color from AppBar (white)
                cursor: 'pointer',
              }}
              onClick={() => handleNavigation('/')}
            >
              DrishyaScan
            </Typography>
          </Box>

          {isMobile ? renderMobileNav() : renderDesktopNav()}
        </Toolbar>
      </Box>
    </StyledAppBar>
  );
}

export default Navbar; 