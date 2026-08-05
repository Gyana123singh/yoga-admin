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

  return (
    <AppContext.Provider value={{
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
