import { DataSource } from 'typeorm';
import { createRegistry } from 'ts_scenario';
import { Organization } from '../domain/organizations/organization.entity';
import { ReportingPeriod } from '../domain/reporting-periods/reporting-period.entity';
import { EmissionEntry } from '../domain/emission-entries/emission-entry.entity';
import { catalog } from './scenarios/catalog';
import './scenarios/schema';

export function createNetCeroRegistry(dataSource: DataSource) {
  return createRegistry(catalog, {
    create: {
      organizations: async ({ attrs }) => {
        const saved = await dataSource.getRepository(Organization).save(new Organization({ name: attrs.name }));
        return { id: saved.id, name: saved.name };
      },
      reportingPeriods: async ({ attrs }) => {
        const saved = await dataSource.getRepository(ReportingPeriod).save(new ReportingPeriod({
          year: attrs.year,
          startDate: new Date(attrs.startDate),
          endDate: new Date(attrs.endDate),
          belongsToOrganizationId: attrs.orgId,
        }));
        return { id: saved.id, year: saved.year, startDate: saved.startDate, endDate: saved.endDate, orgId: saved.belongsToOrganizationId };
      },
      emissionEntries: async ({ attrs }) => {
        const saved = await dataSource.getRepository(EmissionEntry).save(new EmissionEntry({
          scope: attrs.scope,
          category: attrs.category,
          source: attrs.source,
          value: attrs.value,
          unit: attrs.unit,
          description: attrs.description,
          belongsToReportingPeriodId: attrs.reportingPeriodId,
        }));
        return {
          id: saved.id, scope: saved.scope, category: saved.category, source: saved.source,
          value: saved.value, unit: saved.unit, description: saved.description,
          reportingPeriodId: saved.belongsToReportingPeriodId,
        };
      },
    },
  });
}
