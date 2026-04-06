'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Avatar,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../../contexts';
import { authApi, DemoUser } from '../../../api';

const roleColors: Record<string, 'success' | 'warning' | 'default'> = {
  admin: 'success',
  edit: 'warning',
  view: 'default',
};

const avatarColors: Record<string, string> = {
  'peter@famly-demo.com': '#F39C12',
  'lois@famly-demo.com': '#E74C3C',
  'chris@famly-demo.com': '#3498DB',
  'meg@famly-demo.com': '#9B59B6',
  'stewie@famly-demo.com': '#1ABC9C',
  'brian@famly-demo.com': '#7B2C5F',
};

export default function DemoPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoUsers = async () => {
      try {
        const users = await authApi.getDemoUsers();
        setDemoUsers(users);
      } catch (err) {
        setError('Failed to load demo users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDemoUsers();
  }, []);

  const handleDemoLogin = async (email: string) => {
    setError('');
    setSelectedEmail(email);

    try {
      await demoLogin(email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
      setSelectedEmail(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1, textAlign: 'center' }}>
        Demo Mode
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: 'center' }}
      >
        Experience Famly with the Griffin family! Select a character to explore
        different permission levels.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {demoUsers.map((user) => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardActionArea
                onClick={() => handleDemoLogin(user.email)}
                disabled={selectedEmail !== null}
              >
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: avatarColors[user.email] || '#7B2C5F',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {selectedEmail === user.email ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          color={roleColors[user.role]}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Want your own account?{' '}
          <MuiLink component={Link} href="/register" underline="hover">
            Sign up
          </MuiLink>
          {' or '}
          <MuiLink component={Link} href="/login" underline="hover">
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
