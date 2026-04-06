'use client';

import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { HouseholdProvider } from '../contexts/HouseholdContext';
import { ApolloProvider } from './ApolloProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
        },
      })
  );

  return (
    <ApolloProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <CssBaseline />
          <AuthProvider>
            <HouseholdProvider>{children}</HouseholdProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
