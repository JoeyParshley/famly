import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  transactionsApi,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
} from '../api';
import { useHousehold } from '../contexts';

export function useTransactions(filters: TransactionFilters = {}) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['transactions', householdId, filters],
    queryFn: () =>
      householdId
        ? transactionsApi.list(householdId, filters)
        : Promise.resolve({ transactions: [], total: 0 }),
    enabled: !!householdId,
  });
}

export function useTransaction(transactionId: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['transactions', householdId, transactionId],
    queryFn: () =>
      householdId
        ? transactionsApi.get(householdId, transactionId)
        : Promise.reject(),
    enabled: !!householdId && !!transactionId,
  });
}

export function useRecentTransactions(limit: number = 10) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['transactions', householdId, 'recent', limit],
    queryFn: () =>
      householdId
        ? transactionsApi.getRecent(householdId, limit)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useTransactionCategories() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['transactions', householdId, 'categories'],
    queryFn: () =>
      householdId
        ? transactionsApi.getCategories(householdId)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useCreateTransaction() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      householdId
        ? transactionsApi.create(householdId, data)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', householdId] });
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
      queryClient.invalidateQueries({ queryKey: ['analytics', householdId] });
    },
  });
}

export function useUpdateTransaction() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTransactionRequest;
    }) =>
      householdId
        ? transactionsApi.update(householdId, id, data)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', householdId] });
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
      queryClient.invalidateQueries({ queryKey: ['analytics', householdId] });
    },
  });
}

export function useDeleteTransaction() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (id: string) =>
      householdId
        ? transactionsApi.delete(householdId, id)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', householdId] });
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
      queryClient.invalidateQueries({ queryKey: ['analytics', householdId] });
    },
  });
}
