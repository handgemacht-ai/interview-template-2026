import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getDbConfig } from './db-config';
import { Organization } from '../domain/organizations/organization.entity';
import { ReportingPeriod } from '../domain/reporting-periods/reporting-period.entity';
import { EmissionEntry } from '../domain/emission-entries/emission-entry.entity';

export const entities = [Organization, ReportingPeriod, EmissionEntry];

export function createDataSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    ...getDbConfig(),
    synchronize: true,
    entities,
    namingStrategy: new SnakeNamingStrategy(),
  });
}
