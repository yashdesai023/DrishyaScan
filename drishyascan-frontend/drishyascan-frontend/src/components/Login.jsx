import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // For now, log the values
    console.log('Login submitted:', { email, password });
    
    // Reset form (optional)
    // setEmail('');
    // setPassword('');
    // setErrors({});
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100">DrishyaScan</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Accessibility analysis made simple</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            error={errors.email}
          />
          
          <FormInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            error={errors.password}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
          
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            Login
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;