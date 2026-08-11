import { useQuery } from '@tanstack/react-query';
import type { IEmissionEntry } from '@interview/common';
import { apiService } from '../../common/api-service';

export const emissionEntryKeys = {
  all: (organizationId: string, reportingPeriodId: string) =>
    [
      'organizations',
      organizationId,
      'reporting-periods',
      reportingPeriodId,
      'emission-entries',
    ] as const,
};

export function useEmissionEntriesQuery(
  organizationId: string,
  reportingPeriodId: string
) {
  return useQuery({
    queryKey: emissionEntryKeys.all(organizationId, reportingPeriodId),
    queryFn: async () => {
      const { data } = await apiService.get<IEmissionEntry[]>(
        `/organizations/${organizationId}/reporting-periods/${reportingPeriodId}/emission-entries`
      );
      return data;
    },
    enabled: !!organizationId && !!reportingPeriodId,
  });
}
