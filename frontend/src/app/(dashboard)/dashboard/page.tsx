'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import {
  useDashboardSummary,
  useRecentTransactions,
  useIncomeExpenseTrends,
  useBalanceTrends,
} from '../../../hooks';
import { useHousehold } from '../../../contexts';
import {
  SpendingPieChart,
  IncomeExpenseChart,
  BalanceTrendChart,
} from '../../../components/charts';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

function StatCard({ title, value, subtitle, icon, trend, loading }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        </Box>
        {loading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color:
                trend === 'up'
                  ? 'success.main'
                  : trend === 'down'
                  ? 'error.main'
                  : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
            }}
          >
            {trend === 'up' && <TrendingUpIcon fontSize="small" />}
            {trend === 'down' && <TrendingDownIcon fontSize="small" />}
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { currentHousehold } = useHousehold();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: recentTransactions, isLoading: transactionsLoading } =
    useRecentTransactions(5);
  const { data: incomeExpenseData, isLoading: incomeExpenseLoading } =
    useIncomeExpenseTrends(6);
  const { data: balanceTrends, isLoading: balanceTrendsLoading } =
    useBalanceTrends(30);

  if (!currentHousehold) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          No household selected
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create a household to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Balance"
            value={formatCurrency(summary?.totalBalance || 0)}
            icon={<AccountBalanceWalletIcon />}
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Income"
            value={formatCurrency(summary?.monthlyIncome || 0)}
            icon={<TrendingUpIcon />}
            trend="up"
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(summary?.monthlyExpenses || 0)}
            icon={<TrendingDownIcon />}
            trend="down"
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Savings Rate"
            value={`${summary?.savingsRate || 0}%`}
            subtitle={
              summary?.savingsRate !== undefined
                ? summary.savingsRate >= 20
                  ? 'Great job!'
                  : summary.savingsRate >= 10
                  ? 'On track'
                  : 'Room to improve'
                : ''
            }
            icon={<SavingsIcon />}
            trend={
              summary?.savingsRate !== undefined
                ? summary.savingsRate >= 10
                  ? 'up'
                  : 'down'
                : 'neutral'
            }
            loading={summaryLoading}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Income vs Expenses
              </Typography>
              {incomeExpenseLoading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <IncomeExpenseChart data={incomeExpenseData || []} height={300} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Spending by Category
              </Typography>
              {summaryLoading ? (
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              ) : (
                <SpendingPieChart
                  data={summary?.topSpendingCategories || []}
                  height={280}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Balance Trends and Recent Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Account Balance Trends (30 Days)
              </Typography>
              {balanceTrendsLoading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <BalanceTrendChart data={balanceTrends || []} height={300} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Recent Transactions
              </Typography>
              {transactionsLoading ? (
                [...Array(5)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1 }} />
                ))
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <List disablePadding>
                  {recentTransactions.map((tx, index) => (
                    <React.Fragment key={tx.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={tx.description || tx.category}
                          secondary={formatDate(tx.occurredOn)}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 500,
                            noWrap: true,
                          }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            color: tx.amount >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {tx.amount >= 0 ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </Typography>
                      </ListItem>
                      {index < recentTransactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent transactions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
