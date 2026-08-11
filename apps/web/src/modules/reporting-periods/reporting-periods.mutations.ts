import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IReportingPeriod } from '@interview/common';
import { apiService } from '../../common/api-service';
import { reportingPeriodKeys } from './reporting-periods.queries';

interface ReportingPeriodInput {
  year: number;
  startDate: string;
  endDate: string;
}

export function useCreateReportingPeriod(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReportingPeriodInput) => {
      const { data: result } = await apiService.post<IReportingPeriod>(
        `/organizations/${organizationId}/reporting-periods`,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportingPeriodKeys.all(organizationId),
      });
    },
  });
}

export function useUpdateReportingPeriod(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ReportingPeriodInput;
    }) => {
      const { data: result } = await apiService.put<IReportingPeriod>(
        `/organizations/${organizationId}/reporting-periods/${id}`,
        data
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportingPeriodKeys.all(organizationId),
      });
    },
  });
}

export function useDeleteReportingPeriod(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(
        `/organizations/${organizationId}/reporting-periods/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reportingPeriodKeys.all(organizationId),
      });
    },
  });
}
