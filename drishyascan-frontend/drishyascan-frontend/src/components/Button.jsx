import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  fullWidth = false,
  className = '',
  disabled = false,
  ...rest 
}) => {
  const baseStyles = "font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-900",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-900",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-900",
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;