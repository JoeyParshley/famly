import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi, CreateBudgetRequest, UpdateBudgetRequest } from '../api';
import { useHousehold } from '../contexts';

export function useBudgets() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['budgets', householdId],
    queryFn: () =>
      householdId ? budgetsApi.list(householdId) : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useBudget(budgetId: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['budgets', householdId, budgetId],
    queryFn: () =>
      householdId ? budgetsApi.get(householdId, budgetId) : Promise.reject(),
    enabled: !!householdId && !!budgetId,
  });
}

export function useBudgetsWithSpending(startDate?: string, endDate?: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['budgets', householdId, 'with-spending', startDate, endDate],
    queryFn: () =>
      householdId
        ? budgetsApi.listWithSpending(householdId, startDate, endDate)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useBudgetSummary() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['budgets', householdId, 'summary'],
    queryFn: () =>
      householdId ? budgetsApi.getSummary(householdId) : Promise.reject(),
    enabled: !!householdId,
  });
}

export function useCreateBudget() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) =>
      householdId ? budgetsApi.create(householdId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', householdId] });
    },
  });
}

export function useUpdateBudget() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      householdId ? budgetsApi.update(householdId, id, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', householdId] });
    },
  });
}

export function useDeleteBudget() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (id: string) =>
      householdId ? budgetsApi.delete(householdId, id) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', householdId] });
    },
  });
}
