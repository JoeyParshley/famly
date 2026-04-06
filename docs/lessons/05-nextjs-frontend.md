# Module 5: Next.js App Development

## Learning Objectives

By the end of this module, you will understand:
- Next.js App Router architecture
- File-based routing
- Server vs Client Components
- Layouts and route groups
- Environment variables
- Styling with MUI

---

## Lesson 5.1: Next.js Architecture

### What is Next.js?

Next.js is a React framework that provides:
- **File-based routing** - Files become URLs
- **Server-side rendering (SSR)** - Better SEO and performance
- **Static generation** - Pre-built pages
- **API routes** - Backend in the same project
- **Built-in optimizations** - Images, fonts, code splitting

### App Router vs Pages Router

Famly uses the **App Router** (Next.js 13+):

```
frontend/src/app/           # App Router (modern)
├── layout.tsx              # Root layout
├── page.tsx                # Home page (/)
├── (auth)/                 # Route group
│   ├── login/page.tsx      # /login
│   └── register/page.tsx   # /register
└── (dashboard)/            # Route group
    ├── layout.tsx          # Dashboard layout
    └── accounts/page.tsx   # /accounts
```

### Key Configuration

**File:** `frontend/next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration options
};

export default nextConfig;
```

**File:** `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Import aliases
    }
  }
}
```

### Exercise 5.1

Look at the URL paths in Famly. What file would create `/debts/payoff`?

---

## Lesson 5.2: File-Based Routing

### Route Mapping

| File Path | URL |
|-----------|-----|
| `app/page.tsx` | `/` |
| `app/login/page.tsx` | `/login` |
| `app/accounts/page.tsx` | `/accounts` |
| `app/debts/[id]/page.tsx` | `/debts/123` (dynamic) |

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | Page component (required for route) |
| `layout.tsx` | Shared layout wrapper |
| `loading.tsx` | Loading UI (automatic Suspense) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

### Dynamic Routes

```
app/accounts/[id]/page.tsx  → /accounts/abc123

// Access the parameter
export default function AccountPage({ params }: { params: { id: string } }) {
  return <div>Account: {params.id}</div>;
}
```

### Route Groups

Organize routes without affecting URLs:

```
app/
├── (auth)/              # Group for auth pages
│   ├── layout.tsx       # Auth-specific layout
│   ├── login/page.tsx   # /login (not /auth/login)
│   └── register/page.tsx
├── (dashboard)/         # Group for dashboard pages
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── accounts/page.tsx   # /accounts
│   └── transactions/page.tsx
```

The parentheses `()` create a group that doesn't appear in the URL.

---

## Lesson 5.3: Layouts

### Root Layout

**File:** `frontend/src/app/layout.tsx`

```tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Famly — Smart money for every household',
  description: 'Family budget management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

### Nested Layout (Dashboard)

**File:** `frontend/src/app/(dashboard)/layout.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { Sidebar, Header } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
```

### How Layouts Nest

```
Request to /accounts

1. RootLayout wraps everything
   └── 2. DashboardLayout (from (dashboard)/layout.tsx)
       └── 3. AccountsPage (from (dashboard)/accounts/page.tsx)
```

### Exercise 5.2

Create a layout for the auth pages that centers content vertically and horizontally.

---

## Lesson 5.4: Server vs Client Components

### Server Components (Default)

By default, components in the App Router are Server Components:

```tsx
// This runs on the server
export default function AboutPage() {
  // Can access server resources directly
  // Cannot use hooks, browser APIs, or event handlers
  return <h1>About</h1>;
}
```

### Client Components

Add `'use client'` directive for interactivity:

```tsx
'use client';  // Required for client-side features

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);  // Hooks require 'use client'

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### When to Use Each

| Server Components | Client Components |
|-------------------|-------------------|
| Fetch data | useState, useEffect |
| Access backend | Event handlers (onClick) |
| Keep secrets secure | Browser APIs |
| Reduce JS bundle | Interactive UI |

### Famly Pattern

Most Famly pages are Client Components because they need:
- Authentication state (`useAuth`)
- Data fetching hooks (`useAccounts`)
- Interactive forms

**File:** `frontend/src/app/(dashboard)/accounts/page.tsx`

```tsx
'use client';  // Client component for interactivity

import { useAccounts, useCreateAccount } from '@/hooks/useAccounts';

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  // ... interactive logic
}
```

### Exercise 5.3

Why does `frontend/src/app/layout.tsx` NOT have `'use client'`?

---

## Lesson 5.5: Navigation

### Link Component

```tsx
import Link from 'next/link';

function Sidebar() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/accounts">Accounts</Link>
      <Link href={`/accounts/${account.id}`}>View Account</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
'use client';

import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    await login(email, password);
    router.push('/dashboard');  // Navigate after login
  };

  const goBack = () => {
    router.back();  // Go to previous page
  };
}
```

### Navigation in Famly

**File:** `frontend/src/components/layout/Sidebar.tsx`

```tsx
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
  // ...
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <List>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          selected={pathname === item.path}
          onClick={() => router.push(item.path)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}
```

---

## Lesson 5.6: Environment Variables

### Configuration

**File:** `frontend/.env.local`

```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql

# Server-only variables (NOT exposed to browser)
API_SECRET_KEY=secret123
```

### Access in Code

```tsx
// Client-side: Only NEXT_PUBLIC_ variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side: All variables (in Server Components, API routes)
const secret = process.env.API_SECRET_KEY;
```

### Environment Files

```
.env                # Default for all environments
.env.local          # Local overrides (git-ignored)
.env.development    # Development mode
.env.production     # Production mode
```

### Exercise 5.4

Why must browser-accessible environment variables start with `NEXT_PUBLIC_`?

---

## Lesson 5.7: Styling with Material-UI

### Theme Configuration

**File:** `frontend/src/theme/theme.ts`

```tsx
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3E50',
    },
    secondary: {
      main: '#7B2C5F',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5D7A8F',
    },
    background: {
      default: '#1A1A2E',
      paper: '#16213E',
    },
  },
});
```

### Using MUI Components

```tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function AccountCard({ account }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <AccountBalanceIcon color="primary" />
          <Typography variant="h6">{account.name}</Typography>
        </Box>
        <Typography variant="h4" color="primary">
          ${account.balance.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

### The `sx` Prop

MUI's inline styling system:

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,                    // 2 * 8px = 16px (theme spacing)
    p: 3,                      // padding: 24px
    m: 'auto',                 // margin: auto
    maxWidth: 600,
    bgcolor: 'background.paper',  // Theme color
    borderRadius: 1,           // theme.shape.borderRadius
    '&:hover': {               // Pseudo-selectors
      bgcolor: 'action.hover',
    },
  }}
>
```

### Responsive Design

```tsx
<Grid container spacing={3}>
  {/* 12 columns on small, 6 on medium, 4 on large */}
  <Grid item xs={12} md={6} lg={4}>
    <StatsCard title="Balance" value={totalBalance} />
  </Grid>
  <Grid item xs={12} md={6} lg={4}>
    <StatsCard title="Income" value={monthlyIncome} />
  </Grid>
</Grid>

// Or with sx
<Box
  sx={{
    width: { xs: '100%', md: '50%', lg: '33%' },
    display: { xs: 'none', md: 'block' },  // Hide on mobile
  }}
>
```

### Exercise 5.5

Study `frontend/src/app/(dashboard)/dashboard/page.tsx`. How does it use:
1. Grid for layout?
2. Cards for content?
3. Theme colors?

---

## Lesson 5.8: Page Implementation

### Full Page Example

**File:** `frontend/src/app/(dashboard)/accounts/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAccounts, useCreateAccount, useDeleteAccount } from '@/hooks/useAccounts';

export default function AccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: accounts, isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  // Loading state
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Error state
  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">Failed to load accounts</Typography>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );
  }

  // Empty state
  if (!accounts?.length) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary" gutterBottom>
          No accounts yet
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Your First Account
        </Button>
      </Box>
    );
  }

  // Normal state
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} md={6} lg={4} key={account.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{account.name}</Typography>
                <Typography variant="h4" color="primary">
                  ${Number(account.balance).toFixed(2)}
                </Typography>
                <Typography color="text.secondary">
                  {account.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Account</DialogTitle>
        <DialogContent>
          {/* Account form */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
```

---

## Module Summary

### Key Takeaways

1. **File-based routing** - Files in `app/` become URLs
2. **Route groups** - Organize without affecting URLs `(groupName)`
3. **Layouts nest** - Parent layouts wrap child pages
4. **Client vs Server** - Use `'use client'` for interactivity
5. **Environment variables** - `NEXT_PUBLIC_` for browser access
6. **MUI styling** - Use `sx` prop and theme tokens

### Files to Study

| File | Concepts |
|------|----------|
| `app/layout.tsx` | Root layout, providers |
| `app/(dashboard)/layout.tsx` | Protected layout |
| `app/(dashboard)/accounts/page.tsx` | Full page pattern |
| `components/layout/Sidebar.tsx` | Navigation |
| `theme/theme.ts` | MUI theming |

### Practice Exercises

1. Create a `/settings` page with user preferences
2. Add a loading.tsx file for automatic loading states
3. Create a 404 page (not-found.tsx)
4. Add breadcrumb navigation

---

**Next Module:** [Apollo Client & GraphQL Frontend](./06-apollo-graphql-frontend.md)
