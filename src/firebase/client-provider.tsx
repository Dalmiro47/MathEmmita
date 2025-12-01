'use client';

import React, { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { app, auth, db } from './config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export const FirebaseClientProvider: React.FC<FirebaseClientProviderProps> = ({ children }) => {
  return (
    <FirebaseProvider value={{ app, auth, db }}>
      {children}
    </FirebaseProvider>
  );
};
