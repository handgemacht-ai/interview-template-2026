import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IEmissionEntry } from '@interview/common';
import type { EmissionScope } from '@interview/common';
import { apiService } from '../../common/api-service';
import { emissionEntryKeys } from './emission-entries.queries';

interface EmissionEntryInput {
  scope: EmissionScope;
  category: string;
  source: string;
  value: number;
  unit: string;
  description?: string | null;
}

export function useCreateEmissionEntry(
  organizationId: string,
  reportingPeriodId: string
) {
  const queryClient = useQueryClient();
  const basePath = `/organizations/${organizationId}/reporting-periods/${reportingPeriodId}/emission-entries`;

  return useMutation({
    mutationFn: async (data: EmissionEntryInput) => {
      const { data: result } = await apiService.post<IEmissionEntry>(
        basePath,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emissionEntryKeys.all(organizationId, reportingPeriodId),
      });
    },
  });
}

export function useUpdateEmissionEntry(
  organizationId: string,
  reportingPeriodId: string
) {
  const queryClient = useQueryClient();
  const basePath = `/organizations/${organizationId}/reporting-periods/${reportingPeriodId}/emission-entries`;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: EmissionEntryInput;
    }) => {
      const { data: result } = await apiService.put<IEmissionEntry>(
        `${basePath}/${id}`,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emissionEntryKeys.all(organizationId, reportingPeriodId),
      });
    },
  });
}

export function useDeleteEmissionEntry(
  organizationId: string,
  reportingPeriodId: string
) {
  const queryClient = useQueryClient();
  const basePath = `/organizations/${organizationId}/reporting-periods/${reportingPeriodId}/emission-entries`;

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`${basePath}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emissionEntryKeys.all(organizationId, reportingPeriodId),
      });
    },
  });
}
