import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('English (US)');
  const [toastMessage, setToastMessage] = useState(null);

  // Cmd + K keybinding for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aura_admin_logged_in') !== 'false';
  });
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('aura_admin_user');
    return saved ? JSON.parse(saved) : { name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@aura.io', role: 'Super Administrator' };
  });

  const loginAdmin = (userData) => {
    setIsAuthenticated(true);
    setAdminUser(userData);
    localStorage.setItem('aura_admin_logged_in', 'true');
    localStorage.setItem('aura_admin_user', JSON.stringify(userData));
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    localStorage.setItem('aura_admin_logged_in', 'false');
    localStorage.removeItem('aura_admin_user');
    showToast('Logged out of Admin Portal safely', 'warning');
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      adminUser,
      loginAdmin,
      logoutAdmin,
      isSearchOpen,
      setIsSearchOpen,
      isNotificationsOpen,
      setIsNotificationsOpen,
      selectedUser,
      setSelectedUser,
      currentLanguage,
      setCurrentLanguage,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
