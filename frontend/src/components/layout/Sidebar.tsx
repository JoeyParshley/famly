'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PieChartIcon from '@mui/icons-material/PieChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountBalanceIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'Budgets', path: '/budgets', icon: <PieChartIcon /> },
  { label: 'Debts', path: '/debts', icon: <CreditCardIcon /> },
  { label: 'Payoff Calculator', path: '/debts/payoff', icon: <TrendingDownIcon /> },
  { label: 'Purchase Checker', path: '/purchase-checker', icon: <ShoppingCartIcon /> },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'temporary';
}

export function Sidebar({ open, onClose, variant = 'permanent' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (variant === 'temporary' && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ px: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'dark' ? '#E8E8E8' : '#FFFFFF',
          }}
        >
          Famly
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flex: 1, pt: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? theme.palette.secondary.main
                        : 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ pb: 2 }}>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? theme.palette.secondary.main
                        : 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor:
            theme.palette.mode === 'dark' ? '#0F0F1E' : '#2C3E50',
          borderRight: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
