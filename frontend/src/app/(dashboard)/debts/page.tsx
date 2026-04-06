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
  Skeleton,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import Link from 'next/link';
import {
  useDebts,
  useDebtSummary,
  useCreateDebt,
  useUpdateDebt,
  useDeleteDebt,
} from '../../../hooks';
import { useHousehold } from '../../../contexts';
import { Debt, DebtType, CreateDebtRequest } from '../../../api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const debtTypeLabels: Record<DebtType, string> = {
  mortgage: 'Mortgage',
  auto_loan: 'Auto Loan',
  student_loan: 'Student Loan',
  credit_card: 'Credit Card',
  personal_loan: 'Personal Loan',
  medical: 'Medical',
  other: 'Other',
};

const debtTypeColors: Record<DebtType, string> = {
  mortgage: '#3498DB',
  auto_loan: '#2ECC71',
  student_loan: '#9B59B6',
  credit_card: '#E74C3C',
  personal_loan: '#F39C12',
  medical: '#1ABC9C',
  other: '#7B2C5F',
};

interface DebtFormData {
  name: string;
  type: DebtType;
  amount: string;
  interestRate: string;
  minimumPayment: string;
  paymentDueDay: string;
}

const defaultFormData: DebtFormData = {
  name: '',
  type: 'credit_card',
  amount: '',
  interestRate: '',
  minimumPayment: '',
  paymentDueDay: '',
};

export default function DebtsPage() {
  const { currentHousehold, currentRole } = useHousehold();
  const { data: debts, isLoading } = useDebts();
  const { data: summary } = useDebtSummary();
  const createDebt = useCreateDebt();
  const updateDebt = useUpdateDebt();
  const deleteDebt = useDeleteDebt();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formData, setFormData] = useState<DebtFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

  const canEdit = currentRole === 'edit' || currentRole === 'admin';

  const handleOpenDialog = (debt?: Debt) => {
    if (debt) {
      setEditingDebt(debt);
      setFormData({
        name: debt.name,
        type: debt.type as DebtType,
        amount: debt.amount.toString(),
        interestRate: debt.interestRate.toString(),
        minimumPayment: debt.minimumPayment.toString(),
        paymentDueDay: debt.paymentDueDay?.toString() || '',
      });
    } else {
      setEditingDebt(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDebt(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    const data: CreateDebtRequest = {
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate) || 0,
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      paymentDueDay: formData.paymentDueDay
        ? parseInt(formData.paymentDueDay)
        : undefined,
    };

    if (editingDebt) {
      await updateDebt.mutateAsync({ id: editingDebt.id, data });
    } else {
      await createDebt.mutateAsync(data);
    }
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (debtToDelete) {
      await deleteDebt.mutateAsync(debtToDelete.id);
      setDeleteConfirmOpen(false);
      setDebtToDelete(null);
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
          Debts
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href="/debts/payoff"
            variant="outlined"
            startIcon={<CalculateIcon />}
          >
            Payoff Calculator
          </Button>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Debt
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Debt
                </Typography>
                <Typography variant="h5" fontWeight={600} color="error.main">
                  {formatCurrency(summary.totalDebt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Monthly Minimum
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(summary.totalMinimumPayment)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Highest Interest
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.highestInterestRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Number of Debts
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.debtCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Debts List */}
      <Grid container spacing={3}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : debts && debts.length > 0 ? (
          debts.map((debt) => (
            <Grid item xs={12} sm={6} md={4} key={debt.id}>
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
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {debt.name}
                      </Typography>
                      <Chip
                        label={debtTypeLabels[debt.type as DebtType]}
                        size="small"
                        sx={{
                          mt: 0.5,
                          backgroundColor: debtTypeColors[debt.type as DebtType],
                          color: 'white',
                        }}
                      />
                    </Box>
                    {canEdit && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(debt)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDebtToDelete(debt);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                    {formatCurrency(debt.amount)}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {debt.interestRate}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Minimum Payment
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(debt.minimumPayment)}
                      </Typography>
                    </Box>
                    {debt.paymentDueDay && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {debt.paymentDueDay}
                          {debt.paymentDueDay === 1
                            ? 'st'
                            : debt.paymentDueDay === 2
                            ? 'nd'
                            : debt.paymentDueDay === 3
                            ? 'rd'
                            : 'th'}{' '}
                          of month
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              No debts tracked yet. Add your debts to start planning your payoff
              strategy.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDebt ? 'Edit Debt' : 'Add Debt'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Debt Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as DebtType })
            }
            sx={{ mt: 2 }}
          >
            {Object.entries(debtTypeLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Current Balance"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
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
            label="Minimum Monthly Payment"
            type="number"
            value={formData.minimumPayment}
            onChange={(e) =>
              setFormData({ ...formData, minimumPayment: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Payment Due Day (1-31)"
            type="number"
            value={formData.paymentDueDay}
            onChange={(e) =>
              setFormData({ ...formData, paymentDueDay: e.target.value })
            }
            inputProps={{ min: 1, max: 31 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.name ||
              !formData.amount ||
              createDebt.isPending ||
              updateDebt.isPending
            }
          >
            {editingDebt ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Debt</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{debtToDelete?.name}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteDebt.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
