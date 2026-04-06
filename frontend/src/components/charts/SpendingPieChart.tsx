'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { SpendingByCategory } from '../../api';

const COLORS = [
  '#7B2C5F',
  '#2C3E50',
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#E91E63',
  '#FF5722',
];

interface SpendingPieChartProps {
  data: SpendingByCategory[];
  height?: number;
}

export function SpendingPieChart({ data, height = 300 }: SpendingPieChartProps) {
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
        <Typography color="text.secondary">No spending data available</Typography>
      </Box>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length],
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="subtitle2" fontWeight={600}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value, entry: any) => (
            <span style={{ color: theme.palette.text.primary }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
