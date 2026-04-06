import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi, PurchaseImpactRequest, CreatePaydayRequest } from '../api';
import { useHousehold } from '../contexts';

export function useSpendingByCategory(startDate?: string, endDate?: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['analytics', householdId, 'spending', startDate, endDate],
    queryFn: () =>
      householdId
        ? analyticsApi.getSpendingByCategory(householdId, startDate, endDate)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useBalanceTrends(days: number = 30) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['analytics', householdId, 'trends', days],
    queryFn: () =>
      householdId
        ? analyticsApi.getBalanceTrends(householdId, days)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useIncomeExpenseTrends(months: number = 6) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['analytics', householdId, 'income-expense', months],
    queryFn: () =>
      householdId
        ? analyticsApi.getIncomeExpenseTrends(householdId, months)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useDashboardSummary() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['analytics', householdId, 'dashboard'],
    queryFn: () =>
      householdId
        ? analyticsApi.getDashboardSummary(householdId)
        : Promise.reject(),
    enabled: !!householdId,
  });
}

export function usePurchaseImpact() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: ({
      data,
      threshold,
    }: {
      data: PurchaseImpactRequest;
      threshold?: number;
    }) =>
      householdId
        ? analyticsApi.simulatePurchaseImpact(householdId, data, threshold)
        : Promise.reject(),
  });
}

export function usePaydays() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['analytics', householdId, 'paydays'],
    queryFn: () =>
      householdId
        ? analyticsApi.getPaydays(householdId)
        : Promise.resolve([]),
    enabled: !!householdId,
  });
}

export function useCreatePayday() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (data: CreatePaydayRequest) =>
      householdId
        ? analyticsApi.createPayday(householdId, data)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['analytics', householdId, 'paydays'],
      });
    },
  });
}

export function useDeletePayday() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (paydayId: string) =>
      householdId
        ? analyticsApi.deletePayday(householdId, paydayId)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['analytics', householdId, 'paydays'],
      });
    },
  });
}
