import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import api from '../../api/axios';

const LogoutButton = ({ variant = 'text', size = 'medium', showIcon = true }) => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Call logout endpoint if you have one
            await api.post('/auth/logout');
            
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Close dialog and navigate
            setOpenDialog(false);
            navigate('/login', { replace: true });
        } catch (err) {
            setError('Failed to logout. Please try again.');
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseError = () => {
        setError(null);
    };

    const buttonContent = showIcon ? (
        <IconButton
            color="inherit"
            onClick={handleClick}
            disabled={loading}
            size={size}
        >
            <LogoutIcon />
        </IconButton>
    ) : (
        <Button
            variant={variant}
            onClick={handleClick}
            disabled={loading}
            size={size}
            startIcon={<LogoutIcon />}
            color="error"
        >
            Logout
        </Button>
    );

    return (
        <>
            {showIcon ? (
                <Tooltip title="Logout">
                    {buttonContent}
                </Tooltip>
            ) : (
                buttonContent
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to logout? You will need to login again to access your account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        autoFocus
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LogoutButton; 