import React from 'react';

import { AuthProvider } from './auth';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
