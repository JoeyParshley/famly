# Module 6: Apollo Client & GraphQL Frontend

## Learning Objectives

By the end of this module, you will understand:
- Apollo Client setup and configuration
- Writing GraphQL operations
- Using generated hooks
- Cache management
- Error handling
- Optimistic updates

---

## Lesson 6.1: Apollo Client Setup

### Installation

```bash
npm install @apollo/client graphql
```

### Client Configuration

**File:** `frontend/src/lib/apollo-client.ts`

```typescript
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

// Auth link - adds JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error link - handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error]: ${message}`);

      // Handle authentication errors
      if (
        extensions?.code === 'UNAUTHENTICATED' ||
        message === 'Unauthorized'
      ) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transactions: {
          // Merge paginated results
          keyArgs: ['householdId', 'filters'],
          merge(existing = { items: [] }, incoming) {
            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
      },
    },
  },
});

// Create Apollo Client
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
```

### Provider Setup

**File:** `frontend/src/components/ApolloProvider.tsx`

```tsx
'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
}
```

### Exercise 6.1

What does the `authLink` do? Why is it needed?

---

## Lesson 6.2: Writing GraphQL Operations

### Query Operations

**File:** `frontend/src/graphql/accounts.graphql`

```graphql
query GetAccounts($householdId: ID!) {
  accounts(householdId: $householdId) {
    id
    name
    type
    balance
    institution
    interestRate
    createdAt
  }
}

query GetAccount($householdId: ID!, $id: ID!) {
  account(householdId: $householdId, id: $id) {
    id
    name
    type
    balance
    institution
    interestRate
    createdAt
  }
}

query GetAccountsSummary($householdId: ID!) {
  accountsSummary(householdId: $householdId) {
    totalBalance
    totalAssets
    totalLiabilities
    netWorth
  }
}
```

### Mutation Operations

```graphql
mutation CreateAccount($householdId: ID!, $input: CreateAccountInput!) {
  createAccount(householdId: $householdId, input: $input) {
    id
    name
    type
    balance
  }
}

mutation UpdateAccount($householdId: ID!, $id: ID!, $input: UpdateAccountInput!) {
  updateAccount(householdId: $householdId, id: $id, input: $input) {
    id
    name
    type
    balance
  }
}

mutation DeleteAccount($householdId: ID!, $id: ID!) {
  deleteAccount(householdId: $householdId, id: $id)
}
```

### Fragment Reuse

```graphql
# Define reusable field sets
fragment AccountFields on Account {
  id
  name
  type
  balance
  institution
  createdAt
}

query GetAccounts($householdId: ID!) {
  accounts(householdId: $householdId) {
    ...AccountFields
  }
}

query GetAccount($householdId: ID!, $id: ID!) {
  account(householdId: $householdId, id: $id) {
    ...AccountFields
  }
}
```

### Exercise 6.2

Write a GraphQL query to fetch a household with its members and accounts.

---

## Lesson 6.3: Code Generation

### Why Code Generation?

Generates TypeScript types and React hooks from your `.graphql` files:

- **Type safety** - Catch errors at compile time
- **Auto-completion** - IDE knows all fields
- **Generated hooks** - Ready-to-use React hooks

### Configuration

**File:** `frontend/codegen.ts`

```typescript
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',  // Backend URL
  documents: 'src/**/*.graphql',            // Operation files
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',                        // Base types
        'typescript-operations',             // Operation types
        'typescript-react-apollo',           // React hooks
      ],
      config: {
        withHooks: true,                     // Generate useQuery/useMutation
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;
```

### Running Code Generation

```bash
# Generate once
npm run codegen

# Watch mode (auto-regenerate)
npm run codegen:watch
```

### Generated Output

**File:** `frontend/src/generated/graphql.ts`

```typescript
// Generated types
export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: AccountType;
  balance: Scalars['Float'];
  institution?: Maybe<Scalars['String']>;
};

// Generated query hook
export function useGetAccountsQuery(
  baseOptions: Apollo.QueryHookOptions<GetAccountsQuery, GetAccountsQueryVariables>
) {
  return Apollo.useQuery<GetAccountsQuery, GetAccountsQueryVariables>(
    GetAccountsDocument,
    baseOptions
  );
}

// Generated mutation hook
export function useCreateAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>
) {
  return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CreateAccountDocument,
    baseOptions
  );
}
```

---

## Lesson 6.4: Using Generated Hooks

### Query Hooks

```tsx
import { useGetAccountsQuery, useGetAccountsSummaryQuery } from '@/generated/graphql';

function AccountsPage() {
  const { currentHousehold } = useHousehold();

  // Query with variables
  const {
    data,
    loading,
    error,
    refetch,
  } = useGetAccountsQuery({
    variables: { householdId: currentHousehold.id },
    skip: !currentHousehold,  // Don't run if no household
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {data?.accounts.map(account => (
        <li key={account.id}>
          {account.name}: ${account.balance}
        </li>
      ))}
    </ul>
  );
}
```

### Mutation Hooks

```tsx
import { useCreateAccountMutation, useDeleteAccountMutation } from '@/generated/graphql';

function AccountForm() {
  const { currentHousehold } = useHousehold();

  const [createAccount, { loading, error }] = useCreateAccountMutation({
    // Refetch queries after mutation
    refetchQueries: ['GetAccounts', 'GetAccountsSummary'],
  });

  const handleSubmit = async (data: AccountFormData) => {
    await createAccount({
      variables: {
        householdId: currentHousehold.id,
        input: {
          name: data.name,
          type: data.type,
          balance: data.balance,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

### Exercise 6.3

What's the difference between `loading` and `data` being undefined?

---

## Lesson 6.5: Cache Management

### How Apollo Cache Works

Apollo stores query results in a normalized cache:

```
Cache:
├── ROOT_QUERY
│   └── accounts({"householdId":"abc"}) → [ref:Account:1, ref:Account:2]
├── Account:1
│   ├── id: "1"
│   ├── name: "Checking"
│   └── balance: 1000
└── Account:2
    ├── id: "2"
    ├── name: "Savings"
    └── balance: 5000
```

### Updating Cache After Mutations

**Method 1: refetchQueries**

```tsx
const [createAccount] = useCreateAccountMutation({
  refetchQueries: ['GetAccounts'],  // Re-run this query
});
```

**Method 2: update function**

```tsx
const [createAccount] = useCreateAccountMutation({
  update(cache, { data }) {
    // Read existing data
    const existing = cache.readQuery<GetAccountsQuery>({
      query: GetAccountsDocument,
      variables: { householdId },
    });

    // Write updated data
    cache.writeQuery({
      query: GetAccountsDocument,
      variables: { householdId },
      data: {
        accounts: [...(existing?.accounts || []), data.createAccount],
      },
    });
  },
});
```

**Method 3: cache.modify**

```tsx
const [deleteAccount] = useDeleteAccountMutation({
  update(cache, { data }) {
    cache.modify({
      fields: {
        accounts(existingRefs, { readField }) {
          return existingRefs.filter(
            ref => readField('id', ref) !== deletedId
          );
        },
      },
    });
  },
});
```

### Cache Policies

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Account: {
      keyFields: ['id'],  // How to identify unique Account
    },
    Query: {
      fields: {
        transactions: {
          keyArgs: ['householdId', 'filters'],
          merge(existing = { items: [] }, incoming) {
            // Custom merge for pagination
            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
      },
    },
  },
});
```

### Exercise 6.4

When you create a new account, the list doesn't update immediately. What are your options to fix this?

---

## Lesson 6.6: Error Handling

### Query Errors

```tsx
function AccountsPage() {
  const { data, loading, error } = useGetAccountsQuery({
    variables: { householdId },
  });

  // Network or GraphQL error
  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error loading accounts</AlertTitle>
        {error.message}
        <Button onClick={() => refetch()}>Retry</Button>
      </Alert>
    );
  }

  // Partial data with errors
  if (error && data) {
    // Some fields succeeded, some failed
    return (
      <div>
        <Alert severity="warning">Some data could not be loaded</Alert>
        <AccountList accounts={data.accounts} />
      </div>
    );
  }
}
```

### Mutation Errors

```tsx
function AccountForm() {
  const [createAccount, { loading, error }] = useCreateAccountMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    try {
      setFormError(null);
      await createAccount({ variables: { ... } });
      onSuccess();
    } catch (err) {
      // Handle specific errors
      if (err.message.includes('duplicate')) {
        setFormError('An account with this name already exists');
      } else {
        setFormError('Failed to create account');
      }
    }
  };

  return (
    <form>
      {formError && <Alert severity="error">{formError}</Alert>}
      {error && <Alert severity="error">{error.message}</Alert>}
      {/* form fields */}
    </form>
  );
}
```

### Global Error Handling

**File:** `frontend/src/lib/apollo-client.ts`

```typescript
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // Log to error tracking service
      console.error(`[GraphQL] ${operation.operationName}: ${message}`);

      // Handle auth errors globally
      if (extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    // Network is down
    console.error('[Network error]', networkError);
  }
});
```

---

## Lesson 6.7: Optimistic Updates

### What are Optimistic Updates?

Update the UI immediately before the server responds, then reconcile:

```tsx
const [createAccount] = useCreateAccountMutation({
  optimisticResponse: {
    __typename: 'Mutation',
    createAccount: {
      __typename: 'Account',
      id: 'temp-id',  // Temporary ID
      name: formData.name,
      type: formData.type,
      balance: formData.balance,
      institution: formData.institution,
      createdAt: new Date().toISOString(),
    },
  },
  update(cache, { data }) {
    // Add to cache immediately
    const existing = cache.readQuery<GetAccountsQuery>({
      query: GetAccountsDocument,
      variables: { householdId },
    });

    cache.writeQuery({
      query: GetAccountsDocument,
      variables: { householdId },
      data: {
        accounts: [...(existing?.accounts || []), data.createAccount],
      },
    });
  },
});
```

### Flow with Optimistic Updates

```
1. User clicks "Create"
2. UI updates immediately with temp data (optimistic)
3. Request sent to server
4. Server responds with real data
5. Cache replaces temp data with real data
6. UI updates with final data
```

### When to Use

- **Use for**: Quick actions like toggles, likes, simple creates
- **Avoid for**: Complex operations, actions with side effects

### Exercise 6.5

Write an optimistic update for deleting a transaction.

---

## Lesson 6.8: Real-World Patterns

### Loading States Pattern

```tsx
function AccountsPage() {
  const { data, loading, error, networkStatus } = useGetAccountsQuery({
    variables: { householdId },
    notifyOnNetworkStatusChange: true,
  });

  const isRefetching = networkStatus === NetworkStatus.refetch;

  return (
    <Box>
      {isRefetching && <LinearProgress />}

      {loading && !data ? (
        <AccountsSkeleton />
      ) : error ? (
        <ErrorState error={error} />
      ) : !data?.accounts.length ? (
        <EmptyState />
      ) : (
        <AccountsList accounts={data.accounts} />
      )}
    </Box>
  );
}
```

### Polling Pattern

```tsx
// Auto-refresh every 30 seconds
const { data } = useGetDashboardSummaryQuery({
  variables: { householdId },
  pollInterval: 30000,
});
```

### Lazy Queries

```tsx
// Don't execute until called
const [getAccount, { data, loading }] = useGetAccountLazyQuery();

const handleViewDetails = (id: string) => {
  getAccount({ variables: { householdId, id } });
};
```

### Combining with React Query

Famly uses both Apollo (GraphQL) and React Query (REST):

```tsx
// Apollo for GraphQL
const { data: accounts } = useGetAccountsQuery({ ... });

// React Query for REST
const { data: summary } = useQuery({
  queryKey: ['accountsSummary', householdId],
  queryFn: () => accountsApi.getSummary(householdId),
});
```

---

## Module Summary

### Key Takeaways

1. **Apollo Client manages GraphQL state** - Caching, loading, errors
2. **Code generation provides type safety** - Types and hooks from schema
3. **Cache updates after mutations** - refetchQueries or update function
4. **Error handling at multiple levels** - Query, mutation, global
5. **Optimistic updates improve UX** - Instant feedback

### Files to Study

| File | Concepts |
|------|----------|
| `apollo-client.ts` | Client setup, links, cache |
| `accounts.graphql` | Query/mutation operations |
| `generated/graphql.ts` | Generated types and hooks |
| `ApolloProvider.tsx` | Provider wrapper |

### Practice Exercises

1. Add a mutation for bulk deleting transactions
2. Implement optimistic updates for toggling a budget
3. Add pagination with "load more" to transactions
4. Create a custom hook that combines multiple queries

---

**Next Module:** [Real-World Application](./07-real-world-application.md)
