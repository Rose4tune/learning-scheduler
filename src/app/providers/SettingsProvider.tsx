import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  snapEnabled: boolean;
  snapInterval: number; // 분 단위 (기본 30분)
  setSnapEnabled: (enabled: boolean) => void;
  setSnapInterval: (interval: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [snapInterval, setSnapInterval] = useState(30); // 30분 단위 스냅

  return (
    <SettingsContext.Provider
      value={{
        snapEnabled,
        snapInterval,
        setSnapEnabled,
        setSnapInterval,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
