import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would call your authentication service
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login to DrishyaScan</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-light-text-secondary dark:text-dark-text-secondary mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-light-border dark:border-dark-border rounded-md 
                         bg-light-bg-primary dark:bg-dark-bg-primary"
              required
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-light-text-secondary dark:text-dark-text-secondary mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-light-border dark:border-dark-border rounded-md 
                         bg-light-bg-primary dark:bg-dark-bg-primary"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="btn-primary w-full"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Don't have an account? 
            <a href="/register" className="text-primary ml-1 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;