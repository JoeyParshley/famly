'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { BalanceTrend } from '../../api';

const COLORS = [
  '#3498DB',
  '#2ECC71',
  '#9B59B6',
  '#F39C12',
  '#E74C3C',
  '#1ABC9C',
  '#E91E63',
];

interface BalanceTrendChartProps {
  data: BalanceTrend[];
  height?: number;
}

export function BalanceTrendChart({ data, height = 300 }: BalanceTrendChartProps) {
  const theme = useTheme();

  // Transform data to group by date with multiple accounts as separate series
  const { chartData, accounts } = useMemo(() => {
    const accountSet = new Set<string>();
    const dateMap = new Map<string, { date: string; [key: string]: string | number }>();

    data.forEach((item) => {
      accountSet.add(item.accountName);
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, { date: item.date });
      }
      const entry = dateMap.get(item.date)!;
      entry[item.accountName] = item.balance;
    });

    return {
      chartData: Array.from(dateMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
      accounts: Array.from(accountSet),
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
        <Typography color="text.secondary">No balance data available</Typography>
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
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
        {accounts.map((account, index) => (
          <Line
            key={account}
            type="monotone"
            dataKey={account}
            name={account}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
