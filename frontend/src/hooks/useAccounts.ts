import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi, Account, CreateAccountRequest, UpdateAccountRequest } from '../api';
import { useHousehold } from '../contexts';

export function useAccounts() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['accounts', householdId],
    queryFn: () => (householdId ? accountsApi.list(householdId) : Promise.resolve([])),
    enabled: !!householdId,
  });
}

export function useAccount(accountId: string) {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['accounts', householdId, accountId],
    queryFn: () =>
      householdId ? accountsApi.get(householdId, accountId) : Promise.reject(),
    enabled: !!householdId && !!accountId,
  });
}

export function useAccountsSummary() {
  const { currentHousehold } = useHousehold();
  const householdId = currentHousehold?.id;

  return useQuery({
    queryKey: ['accounts', householdId, 'summary'],
    queryFn: () =>
      householdId ? accountsApi.getSummary(householdId) : Promise.reject(),
    enabled: !!householdId,
  });
}

export function useCreateAccount() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (data: CreateAccountRequest) =>
      householdId ? accountsApi.create(householdId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
    },
  });
}

export function useUpdateAccount() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      householdId ? accountsApi.update(householdId, id, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
    },
  });
}

export function useDeleteAccount() {
  const { currentHousehold } = useHousehold();
  const queryClient = useQueryClient();
  const householdId = currentHousehold?.id;

  return useMutation({
    mutationFn: (id: string) =>
      householdId ? accountsApi.delete(householdId, id) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
    },
  });
}
