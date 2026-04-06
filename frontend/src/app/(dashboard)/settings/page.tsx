'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme as useAppTheme } from '../../../contexts';
import { useAuth, useHousehold } from '../../../contexts';
import { usePreferences, useUpdatePreferences, usePaydays, useCreatePayday, useDeletePayday } from '../../../hooks';
import { CreatePaydayRequest } from '../../../api';

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
    month: 'short',
    day: 'numeric',
  });
}

const frequencyLabels: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
};

export default function SettingsPage() {
  const { mode, setTheme } = useAppTheme();
  const { user } = useAuth();
  const { currentHousehold, currentRole } = useHousehold();
  const { data: preferences, isLoading: preferencesLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const { data: paydays, isLoading: paydaysLoading } = usePaydays();
  const createPayday = useCreatePayday();
  const deletePayday = useDeletePayday();

  const [threshold, setThreshold] = useState('500');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [paydayDialogOpen, setPaydayDialogOpen] = useState(false);
  const [newPayday, setNewPayday] = useState<CreatePaydayRequest>({
    name: '',
    amount: 0,
    frequency: 'biweekly',
    nextDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (preferences) {
      setThreshold(preferences.balanceAlertThreshold.toString());
    }
  }, [preferences]);

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    await updatePreferences.mutateAsync({ theme: newTheme });
    setSnackbar({ open: true, message: 'Theme updated' });
  };

  const handleThresholdSave = async () => {
    await updatePreferences.mutateAsync({
      balanceAlertThreshold: parseFloat(threshold),
    });
    setSnackbar({ open: true, message: 'Alert threshold updated' });
  };

  const handleAddPayday = async () => {
    await createPayday.mutateAsync(newPayday);
    setPaydayDialogOpen(false);
    setNewPayday({
      name: '',
      amount: 0,
      frequency: 'biweekly',
      nextDate: new Date().toISOString().split('T')[0],
    });
    setSnackbar({ open: true, message: 'Payday added' });
  };

  const handleDeletePayday = async (paydayId: string) => {
    await deletePayday.mutateAsync(paydayId);
    setSnackbar({ open: true, message: 'Payday removed' });
  };

  const canEditPaydays = currentRole === 'edit' || currentRole === 'admin';

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Profile
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{user?.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              {currentHousehold && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Household
                    </Typography>
                    <Typography variant="body1">{currentHousehold.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Your Role
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {currentRole}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Appearance
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={mode === 'light' ? 'contained' : 'outlined'}
                  startIcon={<LightModeIcon />}
                  onClick={() => handleThemeChange('light')}
                  sx={{ flex: 1 }}
                >
                  Light
                </Button>
                <Button
                  variant={mode === 'dark' ? 'contained' : 'outlined'}
                  startIcon={<DarkModeIcon />}
                  onClick={() => handleThemeChange('dark')}
                  sx={{ flex: 1 }}
                >
                  Dark
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alert Threshold Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Balance Alert Threshold
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Get warnings when a purchase would drop your balance below this amount
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Threshold"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleThresholdSave}
                  disabled={updatePreferences.isPending}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Paydays Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Paydays
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set up your regular income for balance projections
                  </Typography>
                </Box>
                {canEditPaydays && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setPaydayDialogOpen(true)}
                  >
                    Add
                  </Button>
                )}
              </Box>
              {paydaysLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              ) : paydays && paydays.length > 0 ? (
                <List disablePadding>
                  {paydays.map((payday) => (
                    <ListItem key={payday.id} disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={payday.name}
                        secondary={`${formatCurrency(payday.amount)} ${frequencyLabels[payday.frequency]} - Next: ${formatDate(payday.nextDate)}`}
                      />
                      {canEditPaydays && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeletePayday(payday.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No paydays set up yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Household Members Section */}
        {currentHousehold && currentRole === 'admin' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Household Members
                </Typography>
                <List disablePadding>
                  {currentHousehold.members.map((member) => (
                    <ListItem key={member.id} disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={member.user.name}
                        secondary={member.user.email}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: 'capitalize',
                          color:
                            member.role === 'admin'
                              ? 'success.main'
                              : member.role === 'edit'
                              ? 'warning.main'
                              : 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
                        {member.role}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Add Payday Dialog */}
      <Dialog
        open={paydayDialogOpen}
        onClose={() => setPaydayDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Payday</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newPayday.name}
            onChange={(e) =>
              setNewPayday({ ...newPayday, name: e.target.value })
            }
            placeholder="e.g., Main Job Paycheck"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={newPayday.amount || ''}
            onChange={(e) =>
              setNewPayday({ ...newPayday, amount: parseFloat(e.target.value) || 0 })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Frequency"
            value={newPayday.frequency}
            onChange={(e) =>
              setNewPayday({
                ...newPayday,
                frequency: e.target.value as 'weekly' | 'biweekly' | 'monthly',
              })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="biweekly">Bi-weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="date"
            label="Next Payday"
            value={newPayday.nextDate}
            onChange={(e) =>
              setNewPayday({ ...newPayday, nextDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaydayDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddPayday}
            variant="contained"
            disabled={
              !newPayday.name ||
              !newPayday.amount ||
              createPayday.isPending
            }
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
