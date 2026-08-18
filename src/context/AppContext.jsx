import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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
    return localStorage.getItem('aura_admin_logged_in') === 'true' && Boolean(localStorage.getItem('aura_admin_token'));
  });
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('aura_admin_user');
    if (!saved) return null;
    try {
      const u = JSON.parse(saved);
      if (u && (!u.name || u.name === 'Yoga Fitness Admin' || u.name === 'yogapranafitness Admin' || u.name.includes('Yoga Fitness'))) {
        u.name = 'Yoga Prana Fitness Admin';
        localStorage.setItem('aura_admin_user', JSON.stringify(u));
      }
      return u;
    } catch (e) {
      return null;
    }
  });

  // Verify stored token with real-time backend API on initial mount
  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('aura_admin_token');
      if (token && localStorage.getItem('aura_admin_logged_in') === 'true') {
        const res = await api.checkAdminSession();
        if (res && res.success && res.data) {
          const uData = { ...res.data };
          if (!uData.name || uData.name === 'Yoga Fitness Admin' || uData.name === 'yogapranafitness Admin' || uData.name.includes('Yoga Fitness')) {
            uData.name = 'Yoga Prana Fitness Admin';
          }
          setAdminUser(uData);
          localStorage.setItem('aura_admin_user', JSON.stringify(uData));
        } else if (res && res.success === false) {
          logoutAdmin(false);
        }
      }
    }
    verifySession();
  }, []);

  const loginAdmin = (userData, token) => {
    setIsAuthenticated(true);
    setAdminUser(userData);
    localStorage.setItem('aura_admin_logged_in', 'true');
    localStorage.setItem('aura_admin_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('aura_admin_token', token);
    }
  };

  const logoutAdmin = (showNotification = true) => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.setItem('aura_admin_logged_in', 'false');
    localStorage.removeItem('aura_admin_user');
    localStorage.removeItem('aura_admin_token');
    if (showNotification) {
      showToast('Logged out of Admin Portal safely', 'warning');
    }
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
