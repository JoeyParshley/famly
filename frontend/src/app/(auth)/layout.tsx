'use client';

import React from 'react';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { ThemeToggle } from '../../components/layout/ThemeToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <ThemeToggle />
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="primary"
            sx={{ mb: 1 }}
          >
            Famly
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Family Budget Management
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
