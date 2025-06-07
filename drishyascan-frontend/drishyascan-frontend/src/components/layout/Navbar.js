import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo_Site.png';

const navItems = [
  { label: 'Home', path: '/#overview' },
  { label: 'Features', path: '/#features' },
  { label: 'About', path: '/#about' },
  { label: 'Products', path: '/#products' },
  { label: 'Service', path: '/#service' },
  { label: 'Contact', path: '/#contact' },
];

const Navbar = ({ onThemeToggle, isDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (path) => {
    if (path.startsWith('/#')) {
      const sectionId = path.substring(2); // Remove '/#' from the path
      scrollToSection(sectionId);
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={() => handleNavClick(item.path)}
            sx={{ 
              color: 'text.primary',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Login
          </Button>
        </ListItem>
        <ListItem>
          <Button
            component={RouterLink}
            to="/register"
            variant="outlined"
            color="primary"
            fullWidth
          >
            Register
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.5rem',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="DrishyaScan Logo"
            sx={{
              height: 40,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          DrishyaScan
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: 240,
                  bgcolor: 'background.paper',
                },
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              color="primary"
            >
              Register
            </Button>
            <IconButton 
              color="inherit" 
              onClick={onThemeToggle}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 