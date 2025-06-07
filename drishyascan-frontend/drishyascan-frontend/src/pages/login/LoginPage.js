import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, TextField, Link } from '@mui/material';
import { styled } from '@mui/system';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../config/api';

const LoginPageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const LoginForm = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: '400px',
}));

const LoginTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
}));

const RegisterLinkContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
}));

const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/user', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });

      if (response.data) {
        console.log('Login successful:', response.data);
        // Store the token and user data
        if (response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          // Redirect to user route
          navigate('/user', { replace: true });
        } else {
          setError('Login successful, but no access token received.');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(
        error.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm component="form" onSubmit={handleSubmit}>
        <LoginTitle variant="h5">Login to DrishyaScan</LoginTitle>
        
        {location.state?.message && (
          <Typography color="info.main" variant="body2" sx={{ textAlign: 'center' }}>
            {location.state.message}
          </Typography>
        )}

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
          error={!!error}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
          error={!!error}
        />
        <LoginButton 
          variant="contained" 
          color="primary" 
          type="submit"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Logging in...' : 'Login'}
        </LoginButton>
        
        <RegisterLinkContainer>
          <Typography variant="body2">
            Don't have an account? {' '}
            <StyledRouterLink to="/register">
              Register now.
            </StyledRouterLink>
          </Typography>
        </RegisterLinkContainer>

        {error && (
          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage; 