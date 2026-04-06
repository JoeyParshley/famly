'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Chip,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useAccounts, usePurchaseImpact, usePreferences } from '../../../hooks';
import { useHousehold } from '../../../contexts';
import { PurchaseImpactResult } from '../../../api';
import { useTheme } from '@mui/material/styles';

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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function PurchaseCheckerPage() {
  const theme = useTheme();
  const { currentHousehold } = useHousehold();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: preferences } = usePreferences();
  const purchaseImpact = usePurchaseImpact();

  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [result, setResult] = useState<PurchaseImpactResult | null>(null);

  const threshold = preferences?.balanceAlertThreshold || 500;

  const handleCheck = async () => {
    if (!amount || !accountId) return;

    const response = await purchaseImpact.mutateAsync({
      data: {
        amount: parseFloat(amount),
        accountId,
      },
      threshold,
    });
    setResult(response);
  };

  const checkingAccounts = accounts?.filter(
    (a) => a.type === 'checking' || a.type === 'savings'
  );

  if (!currentHousehold) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          No household selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
        Purchase Impact Checker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        See how a purchase will affect your balance and when you&apos;ll recover
      </Typography>

      {/* Input Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Purchase Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                placeholder="100"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="From Account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accountsLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : checkingAccounts?.length === 0 ? (
                  <MenuItem disabled>No accounts available</MenuItem>
                ) : (
                  checkingAccounts?.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} ({formatCurrency(account.balance)})
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheck}
                disabled={!amount || !accountId || purchaseImpact.isPending}
                startIcon={<ShoppingCartIcon />}
              >
                {purchaseImpact.isPending ? 'Checking...' : 'Check Impact'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Alert Banner */}
          <Alert
            severity={result.isBelowThreshold ? 'warning' : 'success'}
            icon={
              result.isBelowThreshold ? <WarningIcon /> : <CheckCircleIcon />
            }
            sx={{ mb: 3 }}
          >
            {result.isBelowThreshold ? (
              <>
                This purchase would bring your balance below your{' '}
                <strong>{formatCurrency(result.alertThreshold)}</strong> threshold.
                {result.recoveryDate && (
                  <>
                    {' '}
                    You&apos;ll recover on{' '}
                    <strong>{formatDate(result.recoveryDate)}</strong>.
                  </>
                )}
              </>
            ) : (
              <>
                You&apos;re good to go! Your balance will remain above your{' '}
                <strong>{formatCurrency(result.alertThreshold)}</strong> threshold.
              </>
            )}
          </Alert>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(result.currentBalance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Purchase Amount
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="error.main">
                    -{formatCurrency(result.purchaseAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: result.isBelowThreshold
                    ? 'warning.light'
                    : 'success.light',
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Balance After
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color={result.isBelowThreshold ? 'warning.dark' : 'success.dark'}
                  >
                    {formatCurrency(result.balanceAfterPurchase)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Next Payday
                    </Typography>
                  </Box>
                  {result.nextPayday ? (
                    <>
                      <Typography variant="h6" fontWeight={600}>
                        {formatDate(result.nextPayday.date)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +{formatCurrency(result.nextPayday.amount)} ({result.daysUntilNextPayday} days)
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No paydays set up
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Balance Projection Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                30-Day Balance Projection
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={result.dailyProjections}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Balance',
                      ]}
                      labelFormatter={(label) => formatDate(label)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 4,
                      }}
                    />
                    <ReferenceLine
                      y={result.alertThreshold}
                      stroke="#F39C12"
                      strokeDasharray="3 3"
                      label={{
                        value: `Threshold: ${formatCurrency(result.alertThreshold)}`,
                        fill: '#F39C12',
                        fontSize: 12,
                      }}
                    />
                    <ReferenceLine
                      y={0}
                      stroke={theme.palette.error.main}
                      strokeDasharray="3 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={(props: any) => {
                        const { payload, cx, cy, key } = props;
                        if (payload.isPayday) {
                          return (
                            <circle
                              key={key}
                              cx={cx}
                              cy={cy}
                              r={6}
                              fill={theme.palette.success.main}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }
                        return <circle key={key} cx={cx} cy={cy} r={0} />;
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Payday
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 2,
                      backgroundColor: '#F39C12',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Alert Threshold
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tips Card */}
      {!result && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Enter a purchase amount and select an account to see how it will
              affect your balance. The tool will:
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
              <li>Show your balance after the purchase</li>
              <li>Warn you if you&apos;ll drop below your alert threshold ({formatCurrency(threshold)})</li>
              <li>Project your balance for the next 30 days</li>
              <li>Show when your next payday will help you recover</li>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              You can adjust your alert threshold in Settings.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
