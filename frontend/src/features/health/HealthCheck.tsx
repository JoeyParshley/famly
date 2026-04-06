'use client';

import { useQuery } from '@tanstack/react-query';
import { Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { apiClient } from '@/api/client';

export function HealthCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Checking backend…</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Backend unreachable. Is the NestJS server running on port 8080?
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Famly
      </Typography>
      <Typography color="text.secondary">Smart money for every household.</Typography>
      <Typography variant="body2" sx={{ mt: 2 }} color="success.main">
        Backend: {JSON.stringify(data)}
      </Typography>
    </Paper>
  );
}
