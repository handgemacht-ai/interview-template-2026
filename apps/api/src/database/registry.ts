import { DataSource } from 'typeorm';
import { createRegistry, type CreateContext } from 'ts_scenario';
import { Organization } from '../domain/organizations/organization.entity';
import { ReportingPeriod } from '../domain/reporting-periods/reporting-period.entity';
import { EmissionEntry } from '../domain/emission-entries/emission-entry.entity';
import { catalog } from './scenarios/catalog';
import './scenarios/schema';

export function createNetCeroRegistry(dataSource: DataSource) {
  return createRegistry(catalog, {
    create: {
      organizations: async ({ attrs }: CreateContext) => {
        const saved = await dataSource.getRepository(Organization).save(
          new Organization({ name: attrs.name as string }),
        );
        return { id: saved.id, name: saved.name };
      },
      reportingPeriods: async ({ attrs }: CreateContext) => {
        const saved = await dataSource.getRepository(ReportingPeriod).save(
          new ReportingPeriod({
            year: attrs.year as number,
            startDate: new Date(attrs.startDate as string),
            endDate: new Date(attrs.endDate as string),
            belongsToOrganizationId: attrs.orgId as string,
          }),
        );
        return {
          id: saved.id,
          year: saved.year,
          startDate: saved.startDate,
          endDate: saved.endDate,
          orgId: saved.belongsToOrganizationId,
        };
      },
      emissionEntries: async ({ attrs }: CreateContext) => {
        const saved = await dataSource.getRepository(EmissionEntry).save(
          new EmissionEntry({
            scope: attrs.scope as EmissionEntry['scope'],
            category: attrs.category as string,
            source: attrs.source as string,
            value: attrs.value as number,
            unit: attrs.unit as string,
            description: (attrs.description as string | null) ?? null,
            belongsToReportingPeriodId: attrs.reportingPeriodId as string,
          }),
        );
        return {
          id: saved.id,
          scope: saved.scope,
          category: saved.category,
          source: saved.source,
          value: saved.value,
          unit: saved.unit,
          description: saved.description,
          reportingPeriodId: saved.belongsToReportingPeriodId,
        };
      },
    },
  });
}
