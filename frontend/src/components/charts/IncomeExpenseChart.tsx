'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { IncomeExpenseSummary } from '../../api';

interface IncomeExpenseChartProps {
  data: IncomeExpenseSummary[];
  height?: number;
}

export function IncomeExpenseChart({
  data,
  height = 300,
}: IncomeExpenseChartProps) {
  const theme = useTheme();

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
        <Typography color="text.secondary">No data available</Typography>
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
            {label}
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
          {payload.length >= 2 && (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mt: 0.5, color: payload[0].value > payload[1].value ? '#2ECC71' : '#E74C3C' }}
            >
              Net: {formatCurrency(payload[0].value - payload[1].value)}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: theme.palette.divider }}
        />
        <YAxis
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
        <Bar
          dataKey="income"
          name="Income"
          fill="#2ECC71"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="#E74C3C"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
