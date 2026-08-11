import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IOrganization } from '@interview/common';
import { apiService } from '../../common/api-service';
import { organizationKeys } from './organizations.queries';

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const { data: result } = await apiService.post<IOrganization>(
        '/organizations',
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const { data: result } = await apiService.put<IOrganization>(
        `/organizations/${id}`,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/organizations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}
