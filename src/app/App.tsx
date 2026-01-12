import React from 'react';
import { ThemeProvider, SettingsProvider } from './providers';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </ThemeProvider>
  );
};
