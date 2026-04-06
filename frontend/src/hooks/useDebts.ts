import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  debtsApi,
  CreateDebtRequest,
  UpdateDebtRequest,
  PayoffRequest,
} from '../api';
import { useHousehold } from '../contexts';

export function useDebts() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId],
    queryFn: () =>
      householdId ? debtsApi.list(householdId) : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useDebt(debtId: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId, debtId],
    queryFn: () =>
      householdId ? debtsApi.get(householdId, debtId) : Promise.reject(),
    enabled: !!householdId && !!debtId,
  });
}

export function useDebtSummary() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId, 'summary'],
    queryFn: () =>
      householdId ? debtsApi.getSummary(householdId) : Promise.reject(),
    enabled: !!householdId,
  });
}

export function usePayoffScenario(request: PayoffRequest) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId, 'payoff', request],
    queryFn: () =>
      householdId
        ? debtsApi.getPayoffScenario(householdId, request)
        : Promise.reject(),
    enabled: !!householdId,
  });
}

export function useSingleDebtPayoff(debtId: string, request: PayoffRequest) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId, debtId, 'payoff', request],
    queryFn: () =>
      householdId
        ? debtsApi.getSingleDebtPayoff(householdId, debtId, request)
        : Promise.reject(),
    enabled: !!householdId && !!debtId,
  });
}

export function useCompareStrategies(extraPayment: number = 0) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['debts', householdId, 'compare', extraPayment],
    queryFn: () =>
      householdId
        ? debtsApi.compareStrategies(householdId, extraPayment)
        : Promise.reject(),
    enabled: !!householdId,
  });
}

export function useCreateDebt() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (data: CreateDebtRequest) =>
      householdId ? debtsApi.create(householdId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', householdId] });
    },
  });
}

export function useUpdateDebt() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDebtRequest }) =>
      householdId ? debtsApi.update(householdId, id, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', householdId] });
    },
  });
}

export function useDeleteDebt() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (id: string) =>
      householdId ? debtsApi.delete(householdId, id) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', householdId] });
    },
  });
}
