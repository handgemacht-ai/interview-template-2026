import { useQuery } from '@tanstack/react-query';
import type { IOrganization } from '@interview/common';
import { apiService } from '../../common/api-service';

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (id: string) => ['organizations', id] as const,
};

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: organizationKeys.all,
    queryFn: async () => {
      const { data } = await apiService.get<IOrganization[]>('/organizations');
      return data;
    },
  });
}

export function useOrganizationQuery(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiService.get<IOrganization>(
        `/organizations/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
}
