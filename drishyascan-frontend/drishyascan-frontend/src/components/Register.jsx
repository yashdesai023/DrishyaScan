import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (!formData.role) newErrors.role = 'Please select a role';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // For now, log the values
    console.log('Registration submitted:', formData);
    
    // Reset form (optional)
    // setFormData({
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   password: '',
    //   confirmPassword: '',
    //   role: '',
    // });
    // setErrors({});
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100">DrishyaScan</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Accessibility analysis made simple</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              error={errors.firstName}
            />
            
            <FormInput
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              error={errors.lastName}
            />
          </div>
          
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            error={errors.email}
          />
          
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••"
            error={errors.password}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
          
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••••"
            error={errors.confirmPassword}
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          
          <div className="mb-6">
            <label 
              htmlFor="role" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
                ${errors.role 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900'}
                appearance-none bg-white dark:bg-gray-700`}
              aria-describedby={errors.role ? "role-error" : undefined}
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
              <option value="Content Manager">Content Manager</option>
            </select>
            {errors.role && (
              <p id="role-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.role}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            Register
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;