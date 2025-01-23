'use client';

import { SessionProvider } from 'next-auth/react';

const ClientSessionProvider = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionProvider;
