'use client';

import React, { useState } from 'react';
import {
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Skeleton,
  Alert,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  useTransactions,
  useTransactionCategories,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useAccounts,
} from '../../../hooks';
import { useHousehold } from '../../../contexts';
import { Transaction, CreateTransactionRequest, TransactionFilters } from '../../../api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface TransactionFormData {
  accountId: string;
  amount: string;
  type: 'expense' | 'income';
  category: string;
  description: string;
  occurredOn: string;
}

const defaultFormData: TransactionFormData = {
  accountId: '',
  amount: '',
  type: 'expense',
  category: '',
  description: '',
  occurredOn: new Date().toISOString().split('T')[0],
};

const commonCategories = [
  'Income',
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
  'Transfer',
  'Other',
];

export default function TransactionsPage() {
  const { currentHousehold, currentRole } = useHousehold();
  const { data: accounts } = useAccounts();
  const { data: categories } = useTransactionCategories();

  const [filters, setFilters] = useState<TransactionFilters>({
    limit: 25,
    offset: 0,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { data: transactionsData, isLoading } = useTransactions({
    ...filters,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>(defaultFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const canEdit = currentRole === 'edit' || currentRole === 'admin';

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        accountId: transaction.account.id,
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.amount >= 0 ? 'income' : 'expense',
        category: transaction.category,
        description: transaction.description || '',
        occurredOn: transaction.occurredOn.split('T')[0],
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        ...defaultFormData,
        accountId: accounts?.[0]?.id || '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    const amount =
      formData.type === 'expense'
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount));

    const data: CreateTransactionRequest = {
      accountId: formData.accountId,
      amount,
      category: formData.category,
      description: formData.description || undefined,
      occurredOn: formData.occurredOn,
    };

    if (editingTransaction) {
      await updateTransaction.mutateAsync({ id: editingTransaction.id, data });
    } else {
      await createTransaction.mutateAsync(data);
    }
    handleCloseDialog();
  };

  const handleDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction.mutateAsync(transactionToDelete.id);
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const allCategories = Array.from(
    new Set([...commonCategories, ...(categories || [])])
  ).sort();

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
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Transaction
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Account"
                value={filters.accountId || ''}
                onChange={(e) =>
                  setFilters({ ...filters, accountId: e.target.value || undefined })
                }
                sx={{ minWidth: 200 }}
                size="small"
              >
                <MenuItem value="">All Accounts</MenuItem>
                {accounts?.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Category"
                value={filters.category || ''}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value || undefined })
                }
                sx={{ minWidth: 150 }}
                size="small"
              >
                <MenuItem value="">All Categories</MenuItem>
                {allCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                label="Start Date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value || undefined })
                }
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                type="date"
                label="End Date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value || undefined })
                }
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <Button
                variant="text"
                onClick={() => {
                  setFilters({ limit: 25, offset: 0 });
                  setPage(0);
                }}
              >
                Clear
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Account</TableCell>
                <TableCell align="right">Amount</TableCell>
                {canEdit && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    {canEdit && <TableCell><Skeleton /></TableCell>}
                  </TableRow>
                ))
              ) : transactionsData?.transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 6 : 5} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactionsData?.transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{formatDate(tx.occurredOn)}</TableCell>
                    <TableCell>
                      {tx.description || (
                        <Typography
                          component="span"
                          color="text.secondary"
                          fontStyle="italic"
                        >
                          No description
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={tx.category} size="small" />
                    </TableCell>
                    <TableCell>{tx.account.name}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: tx.amount >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {tx.amount >= 0 ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    {canEdit && (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(tx)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTransactionToDelete(tx);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={transactionsData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Account"
            value={formData.accountId}
            onChange={(e) =>
              setFormData({ ...formData, accountId: e.target.value })
            }
            required
            sx={{ mt: 2 }}
          >
            {accounts?.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'income' | 'expense',
              })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
            sx={{ mt: 2 }}
          />
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
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={formData.occurredOn}
            onChange={(e) =>
              setFormData({ ...formData, occurredOn: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.accountId ||
              !formData.amount ||
              !formData.category ||
              createTransaction.isPending ||
              updateTransaction.isPending
            }
          >
            {editingTransaction ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteTransaction.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
