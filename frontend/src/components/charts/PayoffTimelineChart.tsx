'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { MonthlyPayment } from '../../api';

const COLORS = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#E91E63',
];

interface PayoffTimelineChartProps {
  data: MonthlyPayment[];
  height?: number;
}

export function PayoffTimelineChart({
  data,
  height = 400,
}: PayoffTimelineChartProps) {
  const theme = useTheme();

  // Transform data to show remaining balance by debt over time
  const { chartData, debts } = useMemo(() => {
    const debtSet = new Set<string>();
    const monthMap = new Map<string, { date: string; [key: string]: string | number }>();

    data.forEach((item) => {
      debtSet.add(item.debtName);
      const key = item.date;
      if (!monthMap.has(key)) {
        monthMap.set(key, { date: key });
      }
      const entry = monthMap.get(key)!;
      entry[item.debtName] = item.remainingBalance;
    });

    // Fill in zeros for paid-off debts
    const debtNames = Array.from(debtSet);
    monthMap.forEach((entry) => {
      debtNames.forEach((debt) => {
        if (entry[debt] === undefined) {
          entry[debt] = 0;
        }
      });
    });

    return {
      chartData: Array.from(monthMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
      debts: debtNames,
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">
          No payoff data available
        </Typography>
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry: any) => sum + (entry.value || 0),
        0
      );
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {formatDate(label)}
          </Typography>
          {payload
            .filter((entry: any) => entry.value > 0)
            .map((entry: any, index: number) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: entry.color }}
              >
                {entry.name}: {formatCurrency(entry.value)}
              </Typography>
            ))}
          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
            Total Remaining: {formatCurrency(total)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: theme.palette.divider }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(value) => {
            if (Math.abs(value) >= 1000) {
              return `$${(value / 1000).toFixed(0)}k`;
            }
            return `$${value}`;
          }}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: theme.palette.text.primary }}>{value}</span>
          )}
        />
        {debts.map((debt, index) => (
          <Area
            key={debt}
            type="monotone"
            dataKey={debt}
            name={debt}
            stackId="1"
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
