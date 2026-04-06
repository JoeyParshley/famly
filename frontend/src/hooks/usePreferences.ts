import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preferencesApi, UpdatePreferencesRequest } from '../api';
import { useAuth } from '../contexts';

export function usePreferences() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => preferencesApi.get(),
    enabled: isAuthenticated,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesRequest) => preferencesApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
