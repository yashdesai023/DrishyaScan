import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, Link, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../config/api';

const RegisterPageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const RegisterForm = styled(Box)(({ theme }) => ({
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

const RegisterTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
}));

const LoginLinkContainer = styled(Box)(({ theme }) => ({
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

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!firstName || !lastName || !email || !password || !role) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        role
      });

      if (response.data) {
        console.log('Registration successful:', response.data);
        setSuccess(true);
        // Store the token if it's returned in the response
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(
        error.response?.data?.message || 
        'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterPageContainer>
      <RegisterForm component="form" onSubmit={handleSubmit}>
        <RegisterTitle variant="h5">Register</RegisterTitle>
        
        {success && (
          <Typography color="success.main" variant="body2" sx={{ textAlign: 'center' }}>
            Registration successful! Redirecting to login...
          </Typography>
        )}

        <TextField
          label="First Name"
          type="text"
          variant="outlined"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Last Name"
          type="text"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
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
        />
        
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
            disabled={loading}
          >
            <MenuItem value="ADMIN">Administrator</MenuItem>
            <MenuItem value="DEVELOPER">Developer</MenuItem>
            <MenuItem value="CONTENT_MANAGER">Content Manager</MenuItem>
          </Select>
        </FormControl>

        <RegisterButton 
          variant="contained" 
          color="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </RegisterButton>

        <LoginLinkContainer>
          <Typography variant="body2">
            Already have an account? {' '}
            <StyledRouterLink to="/login">
              Login here.
            </StyledRouterLink>
          </Typography>
        </LoginLinkContainer>

        {error && (
          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </RegisterForm>
    </RegisterPageContainer>
  );
};

export default RegisterPage; 