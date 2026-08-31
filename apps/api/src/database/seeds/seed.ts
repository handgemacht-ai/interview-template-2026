import { EmissionEntry } from '../../domain/emission-entries/emission-entry.entity';
import { ReportingPeriod } from '../../domain/reporting-periods/reporting-period.entity';
import { Organization } from '../../domain/organizations/organization.entity';
import { createDataSource } from '../data-source';
import { createNetCeroRegistry } from '../registry';
import { defaultScenario } from '../scenarios/default.scenario';

async function seed() {
  const dataSource = createDataSource();

  await dataSource.initialize();
  console.log('Connected to database');

  // Clear existing data (order matters for FK constraints)
  await dataSource.getRepository(EmissionEntry).createQueryBuilder().delete().execute();
  await dataSource.getRepository(ReportingPeriod).createQueryBuilder().delete().execute();
  await dataSource.getRepository(Organization).createQueryBuilder().delete().execute();
  console.log('Cleared existing data');

  // Materialize the default scenario through the registry. The registry's
  // create handlers persist each record via the TypeORM repositories and
  // return the materialized record (id included).
  const registry = createNetCeroRegistry(dataSource);
  const result = await registry.runScenario(defaultScenario, {
    runCtx: { source: 'seed' },
  });

  const records = result.entries();
  const count = (resource: string) =>
    records.filter(([key]) => key.startsWith(`${resource}:`)).length;

  console.log(`Created ${count('organizations')} organizations`);
  console.log(`Created ${count('reportingPeriods')} reporting periods`);
  console.log(`Created ${count('emissionEntries')} emission entries`);

  await dataSource.destroy();
  console.log('Seed completed successfully');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
