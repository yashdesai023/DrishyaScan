// src/components/layout/AuthLayout.jsx
import ThemeToggle from '../ThemeToggle';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary px-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-300">
        {/* Logo/Brand at the top */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            DrishyaScan
          </h2>
          {title && (
            <h1 className="mt-2 text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              {title}
            </h1>
          )}
        </div>
        
        {/* Auth form content */}
        <div>{children}</div>
        
        {/* Footer links for auth pages */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
            &copy; {new Date().getFullYear()} DrishyaScan
          </p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;