import React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import FormLabel from './FormLabel';

const FormInput = ({ 
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  showPassword,
  toggleShowPassword,
  required = false,
  ...rest
}) => {
  const isPasswordField = type === 'password';
  
  return (
    <div className="mb-4">
      <FormLabel id={id} required={required}>
        {label}
      </FormLabel>
      
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={isPasswordField && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900'}`}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        
        {isPasswordField && toggleShowPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;