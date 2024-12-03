'use client'; // Mark this as a client component

import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/context/DialogContext';

const Providers = ({ children }) => {
  return (
    <SessionProvider >
      <DialogProvider>
        {children}
      </DialogProvider>
    </SessionProvider>
  );
};

export default Providers;