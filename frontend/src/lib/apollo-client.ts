import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink, onError } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ error, operation }: ErrorLink.ErrorHandlerOptions) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );

      // Handle authentication errors
      if (
        extensions?.code === 'UNAUTHENTICATED' ||
        message.includes('Unauthorized')
      ) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      }
    });
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          keyArgs: ['filter', ['householdId', 'accountId', 'category']],
          merge(existing, incoming, { args }) {
            const offset = args?.filter?.offset;
            if (!offset || offset === 0) {
              return incoming;
            }
            return {
              ...incoming,
              items: [...(existing?.items || []), ...incoming.items],
            };
          },
        },
      },
    },
    Household: {
      fields: {
        members: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        accounts: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export function createApolloClient() {
  return apolloClient;
}
