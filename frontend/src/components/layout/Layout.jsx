import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Toast from '../common/Toast';

export const ToastContext = React.createContext(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const Layout = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="app-container">
        <Navbar />
        <main className="main-content">{children}</main>
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default Layout;
