import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { authApi } from 'services/api';
import { ROUTES } from 'routes/constants';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return initialState;
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Check for existing token and get user data
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const user = await authApi.getCurrentUser();
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR', payload: 'Failed to restore session' });
          authApi.logout();
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { token, user } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.message || 'Login failed',
      });
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { token, user } = await authApi.register(credentials);
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  // Logout function
  const logout = async () => {
    await authApi.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
    navigate(ROUTES.LOGIN);
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 