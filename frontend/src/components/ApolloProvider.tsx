'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { ReactNode, useMemo } from 'react';
import { apolloClient } from '@/lib/apollo-client';

interface ApolloProviderProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = useMemo(() => apolloClient, []);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
