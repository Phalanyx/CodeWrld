import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface GlobalContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;

  userID: string | null;
  setUserID: React.Dispatch<React.SetStateAction<string | null>>;
  admin: string | null;
  setAdmin: React.Dispatch<React.SetStateAction<string | null>>
  toast: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [userID, setUserID] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>("none");
  const [toast, setToast] = useState<boolean>(false);
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') ?? 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(storedTheme);
    setTheme(storedTheme);

    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  return (
    <AppContext.Provider value={{ theme, setTheme, userID, setUserID, admin, setAdmin, toast, setToast }}>
      {children}
    </AppContext.Provider>
  );
};