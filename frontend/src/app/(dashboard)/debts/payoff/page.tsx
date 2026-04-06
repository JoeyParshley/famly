'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Alert,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useCompareStrategies, useDebts } from '../../../../hooks';
import { useHousehold } from '../../../../contexts';
import { PayoffTimelineChart } from '../../../../components/charts';
import { PayoffStrategy } from '../../../../api';

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
    year: 'numeric',
    month: 'long',
  });
}

export default function PayoffCalculatorPage() {
  const { currentHousehold } = useHousehold();
  const { data: debts, isLoading: debtsLoading } = useDebts();
  const [extraPayment, setExtraPayment] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<PayoffStrategy>('avalanche');

  const { data: comparison, isLoading: comparisonLoading } = useCompareStrategies(extraPayment);

  const isLoading = debtsLoading || comparisonLoading;

  const selectedScenario =
    selectedStrategy === 'avalanche'
      ? comparison?.avalanche
      : comparison?.snowball;

  if (!currentHousehold) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          No household selected
        </Typography>
      </Box>
    );
  }

  if (!debtsLoading && (!debts || debts.length === 0)) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
          Debt Payoff Calculator
        </Typography>
        <Alert severity="info">
          No debts to calculate. Add your debts first to see payoff scenarios.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
        Debt Payoff Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compare strategies and see how extra payments can accelerate your debt payoff
      </Typography>

      {/* Extra Payment Slider */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Extra Monthly Payment
          </Typography>
          <Typography variant="h4" fontWeight={600} color="primary.main" sx={{ mb: 2 }}>
            {formatCurrency(extraPayment)}
          </Typography>
          <Slider
            value={extraPayment}
            onChange={(_, value) => setExtraPayment(value as number)}
            min={0}
            max={1000}
            step={25}
            marks={[
              { value: 0, label: '$0' },
              { value: 250, label: '$250' },
              { value: 500, label: '$500' },
              { value: 750, label: '$750' },
              { value: 1000, label: '$1000' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatCurrency(value)}
          />
        </CardContent>
      </Card>

      {/* Strategy Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={selectedStrategy}
          exclusive
          onChange={(_, value) => value && setSelectedStrategy(value)}
          aria-label="payoff strategy"
        >
          <ToggleButton value="avalanche" sx={{ px: 4 }}>
            Avalanche (Highest Interest First)
          </ToggleButton>
          <ToggleButton value="snowball" sx={{ px: 4 }}>
            Snowball (Lowest Balance First)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Stats */}
      {isLoading ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : selectedScenario ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Debt Free Date
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {formatDate(selectedScenario.debtFreeDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedScenario.totalMonths} months
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TrendingDownIcon color="error" />
                    <Typography variant="body2" color="text.secondary">
                      Total Interest
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600} color="error.main">
                    {formatCurrency(selectedScenario.totalInterest)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SavingsIcon color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Total Paid
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(selectedScenario.totalPaid)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor:
                    comparison?.savings.recommendedStrategy === selectedStrategy
                      ? 'success.light'
                      : 'background.paper',
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    vs Other Strategy
                  </Typography>
                  {selectedStrategy === 'avalanche' ? (
                    <>
                      <Typography variant="h5" fontWeight={600} color="success.main">
                        Save {formatCurrency(comparison?.savings.interestSaved || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {comparison?.savings.monthsSaved || 0} months faster
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" fontWeight={600} color="warning.main">
                        Costs {formatCurrency(Math.abs(comparison?.savings.interestSaved || 0))} more
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        but quicker wins
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payoff Timeline Chart */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Debt Payoff Timeline
              </Typography>
              <PayoffTimelineChart
                data={selectedScenario.monthlySchedule}
                height={400}
              />
            </CardContent>
          </Card>

          {/* Individual Debt Results */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Payoff Order
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Debt</TableCell>
                      <TableCell align="right">Original Balance</TableCell>
                      <TableCell align="right">Interest Paid</TableCell>
                      <TableCell align="right">Total Paid</TableCell>
                      <TableCell align="right">Months</TableCell>
                      <TableCell align="right">Payoff Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedScenario.debtResults
                      .sort((a, b) => a.monthsToPayoff - b.monthsToPayoff)
                      .map((result, index) => (
                        <TableRow key={result.debtId}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              color={index === 0 ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{result.debtName}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(result.originalBalance)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'error.main' }}>
                            {formatCurrency(result.totalInterest)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(result.totalPaid)}
                          </TableCell>
                          <TableCell align="right">
                            {result.monthsToPayoff}
                          </TableCell>
                          <TableCell align="right">
                            {formatDate(result.payoffDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      ) : null}

      {/* Strategy Explanation */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Understanding the Strategies
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                Avalanche Method
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pay minimum on all debts, then put extra money toward the debt with
                the highest interest rate. This method saves the most money on
                interest over time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
                Snowball Method
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pay minimum on all debts, then put extra money toward the smallest
                balance first. This provides quick wins and psychological momentum,
                but may cost more in interest.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
