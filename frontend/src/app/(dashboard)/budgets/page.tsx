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
  LinearProgress,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useBudgetsWithSpending,
  useBudgetSummary,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from '../../../hooks';
import { useHousehold } from '../../../contexts';
import { Budget, BudgetPeriod, CreateBudgetRequest, BudgetWithSpending } from '../../../api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const periodLabels: Record<BudgetPeriod, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const commonCategories = [
  'Groceries',
  'Dining Out',
  'Entertainment',
  'Gas',
  'Utilities',
  'Mortgage',
  'Rent',
  'Auto',
  'Shopping',
  'Healthcare',
  'Insurance',
  'Kids Activities',
  'Pet Expenses',
  'Subscriptions',
  'Travel',
  'Other',
];

interface BudgetFormData {
  category: string;
  amount: string;
  period: BudgetPeriod;
}

const defaultFormData: BudgetFormData = {
  category: '',
  amount: '',
  period: 'monthly',
};

export default function BudgetsPage() {
  const { currentHousehold, currentRole } = useHousehold();
  const { data: budgets, isLoading } = useBudgetsWithSpending();
  const { data: summary } = useBudgetSummary();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithSpending | null>(null);
  const [formData, setFormData] = useState<BudgetFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetWithSpending | null>(null);

  const canEdit = currentRole === 'edit' || currentRole === 'admin';

  const handleOpenDialog = (budget?: BudgetWithSpending) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period as BudgetPeriod,
      });
    } else {
      setEditingBudget(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBudget(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    const data: CreateBudgetRequest = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
    };

    if (editingBudget) {
      await updateBudget.mutateAsync({ id: editingBudget.id, data });
    } else {
      await createBudget.mutateAsync(data);
    }
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (budgetToDelete) {
      await deleteBudget.mutateAsync(budgetToDelete.id);
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
    }
  };

  const getProgressColor = (percent: number): 'success' | 'warning' | 'error' => {
    if (percent >= 100) return 'error';
    if (percent >= 75) return 'warning';
    return 'success';
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
          Budgets
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Budget
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
                  Total Budget
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(summary.totalBudget)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Spent
                </Typography>
                <Typography variant="h5" fontWeight={600} color="error.main">
                  {formatCurrency(summary.totalSpent)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Remaining
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color={summary.totalRemaining >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(summary.totalRemaining)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Over Budget Alert */}
      {summary && summary.overBudgetCategories.length > 0 && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          You&apos;re over budget in: {summary.overBudgetCategories.join(', ')}
        </Alert>
      )}

      {/* Budgets Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : budgets && budgets.length > 0 ? (
          budgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
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
                        {budget.category}
                      </Typography>
                      <Chip
                        label={periodLabels[budget.period as BudgetPeriod]}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    {canEdit && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(budget)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setBudgetToDelete(budget);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(budget.spent)} spent
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(budget.amount)} budget
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(budget.percentUsed, 100)}
                      color={getProgressColor(budget.percentUsed)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          budget.remaining >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {budget.remaining >= 0
                        ? `${formatCurrency(budget.remaining)} left`
                        : `${formatCurrency(Math.abs(budget.remaining))} over`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {budget.percentUsed >= 100 ? (
                        <WarningIcon color="error" fontSize="small" />
                      ) : budget.percentUsed >= 75 ? (
                        <WarningIcon color="warning" fontSize="small" />
                      ) : (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                      <Typography variant="body2" fontWeight={600}>
                        {budget.percentUsed}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              No budgets set up yet. Create your first budget to start tracking
              your spending.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Add Budget'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            sx={{ mt: 2 }}
          >
            {commonCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Budget Amount"
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
            select
            label="Period"
            value={formData.period}
            onChange={(e) =>
              setFormData({ ...formData, period: e.target.value as BudgetPeriod })
            }
            sx={{ mt: 2 }}
          >
            {Object.entries(periodLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.category ||
              !formData.amount ||
              createBudget.isPending ||
              updateBudget.isPending
            }
          >
            {editingBudget ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the &quot;{budgetToDelete?.category}&quot;
            budget?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteBudget.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
