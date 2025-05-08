import React from 'react';

const FormLabel = ({ id, required = false, children }) => {
  return (
    <label 
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      {required && <span className="sr-only">(required)</span>}
    </label>
  );
};

export default FormLabel;