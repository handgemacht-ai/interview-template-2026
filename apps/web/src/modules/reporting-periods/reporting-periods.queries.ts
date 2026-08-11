import { useQuery } from '@tanstack/react-query';
import type { IReportingPeriod } from '@interview/common';
import { apiService } from '../../common/api-service';

export const reportingPeriodKeys = {
  all: (organizationId: string) =>
    ['organizations', organizationId, 'reporting-periods'] as const,
  detail: (organizationId: string, id: string) =>
    ['organizations', organizationId, 'reporting-periods', id] as const,
};

export function useReportingPeriodsQuery(organizationId: string) {
  return useQuery({
    queryKey: reportingPeriodKeys.all(organizationId),
    queryFn: async () => {
      const { data } = await apiService.get<IReportingPeriod[]>(
        `/organizations/${organizationId}/reporting-periods`
      );
      return data;
    },
    enabled: !!organizationId,
  });
}
