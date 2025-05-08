// src/components/layout/MainLayout.jsx
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ title, children }) => {
  return (
    <div className="flex h-screen bg-light-bg-primary dark:bg-dark-bg-primary transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-light-bg-primary dark:bg-dark-bg-primary transition-colors duration-300">
          {/* Page title */}
          {title && (
            <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
              {title}
            </h1>
          )}
          
          {/* Page content */}
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;