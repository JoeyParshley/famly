'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
  useAccounts,
  useAccountsSummary,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '../../../hooks';
import { useHousehold } from '../../../contexts';
import { Account, AccountType, CreateAccountRequest } from '../../../api';

const accountTypeIcons: Record<AccountType, React.ReactNode> = {
  checking: <AccountBalanceIcon />,
  savings: <SavingsIcon />,
  credit: <CreditCardIcon />,
  investment: <TrendingUpIcon />,
  cash: <AttachMoneyIcon />,
};

const accountTypeLabels: Record<AccountType, string> = {
  checking: 'Checking',
  savings: 'Savings',
  credit: 'Credit Card',
  investment: 'Investment',
  cash: 'Cash',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

interface AccountFormData {
  name: string;
  type: AccountType;
  balance: string;
  interestRate: string;
  institution: string;
}

const defaultFormData: AccountFormData = {
  name: '',
  type: 'checking',
  balance: '0',
  interestRate: '0',
  institution: '',
};

export default function AccountsPage() {
  const { currentHousehold, currentRole } = useHousehold();
  const { data: accounts, isLoading } = useAccounts();
  const { data: summary } = useAccountsSummary();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<AccountFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const canEdit = currentRole === 'edit' || currentRole === 'admin';

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type as AccountType,
        balance: account.balance.toString(),
        interestRate: account.interestRate.toString(),
        institution: account.institution || '',
      });
    } else {
      setEditingAccount(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAccount(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    const data: CreateAccountRequest = {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      interestRate: parseFloat(formData.interestRate),
      institution: formData.institution || undefined,
    };

    if (editingAccount) {
      await updateAccount.mutateAsync({ id: editingAccount.id, data });
    } else {
      await createAccount.mutateAsync(data);
    }
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (accountToDelete) {
      await deleteAccount.mutateAsync(accountToDelete.id);
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Accounts
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Account
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Assets
                </Typography>
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {formatCurrency(summary.assets)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Liabilities
                </Typography>
                <Typography variant="h5" fontWeight={600} color="error.main">
                  {formatCurrency(summary.liabilities)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Net Worth
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color={summary.netWorth >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(summary.netWorth)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Accounts List */}
      <Grid container spacing={3}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {accountTypeIcons[account.type as AccountType]}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {account.name}
                        </Typography>
                        <Chip
                          label={accountTypeLabels[account.type as AccountType]}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    {canEdit && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(account)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setAccountToDelete(account);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      color:
                        account.balance >= 0 ? 'text.primary' : 'error.main',
                    }}
                  >
                    {formatCurrency(account.balance)}
                  </Typography>
                  {account.institution && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {account.institution}
                    </Typography>
                  )}
                  {account.interestRate > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {account.interestRate}% APR
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              No accounts found. Add your first account to get started.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add Account'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Account Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Account Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as AccountType })
            }
            sx={{ mt: 2 }}
          >
            {Object.entries(accountTypeLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Current Balance"
            type="number"
            value={formData.balance}
            onChange={(e) =>
              setFormData({ ...formData, balance: e.target.value })
            }
            helperText="Use negative values for credit card balances"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Interest Rate (%)"
            type="number"
            value={formData.interestRate}
            onChange={(e) =>
              setFormData({ ...formData, interestRate: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Institution (optional)"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || createAccount.isPending || updateAccount.isPending}
          >
            {editingAccount ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{accountToDelete?.name}&quot;? This will
            also delete all associated transactions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteAccount.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
