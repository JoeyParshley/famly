# Module 4: React Fundamentals

## Learning Objectives

By the end of this module, you will understand:
- React components and JSX
- Props and state
- Hooks (useState, useEffect, useContext)
- Custom hooks
- Context API for global state
- React best practices

---

## Lesson 4.1: Components and JSX

### What is JSX?

JSX is JavaScript XML - a syntax extension that lets you write HTML-like code in JavaScript:

```tsx
// This JSX:
const element = <h1 className="title">Hello, World!</h1>;

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello, World!');
```

### Functional Components

Modern React uses functional components:

```tsx
// Simple component
function Welcome() {
  return <h1>Welcome to Famly</h1>;
}

// Arrow function component
const Welcome = () => {
  return <h1>Welcome to Famly</h1>;
};

// With implicit return
const Welcome = () => <h1>Welcome to Famly</h1>;
```

### Component with Props

**File:** `frontend/src/components/layout/Header.tsx`

```tsx
interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <AppBar>
      <Toolbar>
        <IconButton onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">{title}</Typography>
      </Toolbar>
    </AppBar>
  );
}
```

### JSX Rules

```tsx
// 1. Must return single root element (or Fragment)
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// Or use Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. Use className instead of class
<div className="container">

// 3. Use camelCase for attributes
<button onClick={handleClick} tabIndex={0}>

// 4. Embed expressions with curly braces
<span>Balance: ${balance.toFixed(2)}</span>
```

### Exercise 4.1

Create a `StatCard` component that takes `title`, `value`, and `icon` props.

---

## Lesson 4.2: State with useState

### Basic State

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // Initial value: 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### State with Objects

```tsx
function TransactionForm() {
  const [transaction, setTransaction] = useState({
    amount: 0,
    category: '',
    description: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setTransaction(prev => ({
      ...prev,  // Spread previous state
      [field]: value,  // Update specific field
    }));
  };

  return (
    <form>
      <input
        value={transaction.amount}
        onChange={(e) => handleChange('amount', Number(e.target.value))}
      />
      <input
        value={transaction.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
    </form>
  );
}
```

### State with Arrays

```tsx
function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);  // Add to array
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));  // Remove from array
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates } : a
    ));
  };
}
```

### Exercise 4.2

Create a todo list component with add, remove, and toggle complete functionality.

---

## Lesson 4.3: Effects with useEffect

### Side Effects

`useEffect` runs code after render - for data fetching, subscriptions, DOM manipulation:

```tsx
import { useEffect, useState } from 'react';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs after component mounts
    async function fetchAccounts() {
      setLoading(true);
      const data = await api.getAccounts();
      setAccounts(data);
      setLoading(false);
    }
    fetchAccounts();
  }, []);  // Empty array = run once on mount

  if (loading) return <Spinner />;
  return <AccountList accounts={accounts} />;
}
```

### Dependency Array

```tsx
// Run once on mount
useEffect(() => {
  console.log('Mounted');
}, []);

// Run when 'id' changes
useEffect(() => {
  fetchAccount(id);
}, [id]);

// Run on every render (usually wrong)
useEffect(() => {
  console.log('Rendered');
});
```

### Cleanup Function

```tsx
useEffect(() => {
  const subscription = api.subscribe(handleUpdate);

  // Cleanup runs before next effect and on unmount
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Real Example from Famly

**File:** `frontend/src/contexts/AuthContext.tsx`

```tsx
useEffect(() => {
  // Hydrate auth state from localStorage on mount
  const token = localStorage.getItem('famly-token');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    refreshUser();
  } else {
    setLoading(false);
  }
}, []);  // Run once on mount
```

### Exercise 4.3

What's wrong with this code? How would you fix it?

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  });  // Missing dependency array!
}
```

---

## Lesson 4.4: Context API

### The Problem Context Solves

Without context, you must pass props through every level:

```tsx
// Prop drilling - tedious and error-prone
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserAvatar user={user} />  {/* Finally used here */}
    </Sidebar>
  </Layout>
</App>
```

### Creating Context

**File:** `frontend/src/contexts/AuthContext.tsx`

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem('famly-token', response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('famly-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Create hook for consuming context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Using Context

```tsx
// Wrap app with provider (in Providers.tsx)
<AuthProvider>
  <HouseholdProvider>
    <App />
  </HouseholdProvider>
</AuthProvider>

// Use in any component
function UserAvatar() {
  const { user, logout } = useAuth();

  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Exercise 4.4

Look at `frontend/src/contexts/HouseholdContext.tsx`. What state does it manage? What actions does it provide?

---

## Lesson 4.5: Custom Hooks

### Why Custom Hooks?

Extract reusable logic from components:

**File:** `frontend/src/hooks/useAccounts.ts`

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHousehold } from '../contexts/HouseholdContext';
import * as accountsApi from '../api/accounts.api';

export function useAccounts() {
  const { currentHousehold } = useHousehold();

  return useQuery({
    queryKey: ['accounts', currentHousehold?.id],
    queryFn: () => accountsApi.list(currentHousehold!.id),
    enabled: !!currentHousehold,  // Only run if household selected
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { currentHousehold } = useHousehold();

  return useMutation({
    mutationFn: (data: CreateAccountDto) =>
      accountsApi.create(currentHousehold!.id, data),
    onSuccess: () => {
      // Invalidate cache to refetch accounts
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
```

### Using Custom Hooks

```tsx
function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
      <button onClick={() => createAccount.mutate({ name: 'New', type: 'checking' })}>
        Add Account
      </button>
    </div>
  );
}
```

### Hook Rules

1. **Only call hooks at the top level** - Not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Components or custom hooks
3. **Name custom hooks with "use" prefix** - `useAccounts`, `useAuth`

```tsx
// WRONG - hook inside condition
function Component({ showUser }) {
  if (showUser) {
    const user = useAuth();  // Error!
  }
}

// CORRECT - call hook unconditionally
function Component({ showUser }) {
  const { user } = useAuth();  // Always called
  if (!showUser) return null;
  return <span>{user.name}</span>;
}
```

### Exercise 4.5

Create a `useLocalStorage` hook that syncs state with localStorage:

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  // Implement this hook
  // Return [value, setValue]
}
```

---

## Lesson 4.6: Component Patterns

### Container/Presentational Pattern

```tsx
// Container: handles data and logic
function TransactionsContainer() {
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  return (
    <TransactionsList
      transactions={transactions || []}
      isLoading={isLoading}
      onDelete={(id) => deleteTransaction.mutate(id)}
    />
  );
}

// Presentational: handles rendering
interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

function TransactionsList({ transactions, isLoading, onDelete }: TransactionsListProps) {
  if (isLoading) return <Skeleton />;

  return (
    <List>
      {transactions.map(tx => (
        <ListItem key={tx.id}>
          <span>{tx.description}</span>
          <button onClick={() => onDelete(tx.id)}>Delete</button>
        </ListItem>
      ))}
    </List>
  );
}
```

### Render Props Pattern

```tsx
// Component that provides data via render prop
function DataFetcher<T>({
  url,
  render,
}: {
  url: string;
  render: (data: T, loading: boolean) => ReactNode;
}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [url]);

  return render(data, loading);
}

// Usage
<DataFetcher<User[]>
  url="/api/users"
  render={(users, loading) =>
    loading ? <Spinner /> : <UserList users={users} />
  }
/>
```

### Composition Pattern

**File:** `frontend/src/components/Providers.tsx`

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from './ApolloProvider';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { HouseholdProvider } from '../contexts/HouseholdContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <AuthProvider>
            <HouseholdProvider>
              {children}
            </HouseholdProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
```

---

## Lesson 4.7: React Best Practices

### 1. Keep Components Small

```tsx
// BAD - massive component
function DashboardPage() {
  // 200 lines of mixed concerns
}

// GOOD - composed of focused components
function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <StatsGrid />
      <ChartsSection />
      <RecentTransactions />
    </div>
  );
}
```

### 2. Lift State Up

```tsx
// State should live in the lowest common ancestor
function ParentComponent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <ItemList onSelect={setSelectedId} />
      <ItemDetails id={selectedId} />
    </>
  );
}
```

### 3. Memoization for Performance

```tsx
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive calculations
const sortedTransactions = useMemo(() =>
  transactions.sort((a, b) => b.date - a.date),
  [transactions]
);

// Memoize callback functions
const handleDelete = useCallback((id: string) => {
  deleteTransaction.mutate(id);
}, [deleteTransaction]);

// Memoize entire components
const TransactionCard = memo(function TransactionCard({ transaction }: Props) {
  return <Card>{/* ... */}</Card>;
});
```

### 4. Type Your Props

```tsx
// Always define prop interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant, size = 'medium', disabled, onClick, children }: ButtonProps) {
  // ...
}
```

### 5. Handle Loading and Error States

```tsx
function AccountsPage() {
  const { data, isLoading, error } = useAccounts();

  if (isLoading) {
    return <AccountsSkeleton />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load accounts" retry={refetch} />;
  }

  if (!data?.length) {
    return <EmptyState message="No accounts yet" action={<CreateAccountButton />} />;
  }

  return <AccountsList accounts={data} />;
}
```

### 6. Avoid Prop Drilling with Context

```tsx
// Instead of passing through multiple levels
<App>
  <Layout theme={theme}>
    <Sidebar theme={theme}>
      <ThemeToggle theme={theme} setTheme={setTheme} />

// Use context
<ThemeProvider>
  <App />
</ThemeProvider>

// Access anywhere
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
}
```

### Exercise 4.6

Review `frontend/src/app/(dashboard)/dashboard/page.tsx`. Identify:
1. What hooks are used?
2. How are loading states handled?
3. How is the component composed?

---

## Module Summary

### Key Takeaways

1. **Components are functions** that return JSX
2. **useState** manages local state
3. **useEffect** handles side effects
4. **Context** provides global state without prop drilling
5. **Custom hooks** extract reusable logic
6. **Keep components small** and focused

### Files to Study

| File | Concepts |
|------|----------|
| `Header.tsx` | Props, event handlers |
| `AuthContext.tsx` | Context pattern |
| `useAccounts.ts` | Custom hooks, React Query |
| `Providers.tsx` | Composition pattern |
| `dashboard/page.tsx` | Real-world component |

### Practice Exercises

1. Create a `useDebounce` hook that delays value updates
2. Build a modal component with open/close state
3. Create a theme context with light/dark modes
4. Refactor a large component into smaller pieces

---

**Next Module:** [Next.js App Development](./05-nextjs-frontend.md)
