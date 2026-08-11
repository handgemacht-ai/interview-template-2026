import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Organization } from '../../domain/organizations/organization.entity';
import { ReportingPeriod } from '../../domain/reporting-periods/reporting-period.entity';
import { EmissionEntry } from '../../domain/emission-entries/emission-entry.entity';
import { EmissionScope } from '@interview/common';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'interview',
    password: 'interview',
    database: 'interview',
    synchronize: true,
    entities: [Organization, ReportingPeriod, EmissionEntry],
    namingStrategy: new SnakeNamingStrategy(),
  });

  await dataSource.initialize();
  console.log('Connected to database');

  // Clear existing data (order matters for FK constraints)
  await dataSource.getRepository(EmissionEntry).createQueryBuilder().delete().execute();
  await dataSource.getRepository(ReportingPeriod).createQueryBuilder().delete().execute();
  await dataSource.getRepository(Organization).createQueryBuilder().delete().execute();
  console.log('Cleared existing data');

  // Create organizations
  const orgRepo = dataSource.getRepository(Organization);
  const org1 = await orgRepo.save(new Organization({ name: 'Acme Manufacturing GmbH' }));
  const org2 = await orgRepo.save(new Organization({ name: 'GreenTech Solutions AG' }));
  console.log(`Created ${2} organizations`);

  // Create reporting periods
  const rpRepo = dataSource.getRepository(ReportingPeriod);
  const org1Rp2024 = await rpRepo.save(
    new ReportingPeriod({
      year: 2024,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      belongsToOrganizationId: org1.id,
    }),
  );
  const org1Rp2025 = await rpRepo.save(
    new ReportingPeriod({
      year: 2025,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      belongsToOrganizationId: org1.id,
    }),
  );
  const org2Rp2024 = await rpRepo.save(
    new ReportingPeriod({
      year: 2024,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      belongsToOrganizationId: org2.id,
    }),
  );
  const org2Rp2025 = await rpRepo.save(
    new ReportingPeriod({
      year: 2025,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      belongsToOrganizationId: org2.id,
    }),
  );
  console.log(`Created ${4} reporting periods`);

  // Create emission entries
  const entryRepo = dataSource.getRepository(EmissionEntry);
  const entries = [
    // Acme 2024
    new EmissionEntry({
      scope: EmissionScope.SCOPE_1,
      category: 'Stationary Combustion',
      source: 'Natural Gas Boiler',
      value: 1250.5,
      unit: 'tCO2e',
      description: 'Main facility heating',
      belongsToReportingPeriodId: org1Rp2024.id,
    }),
    new EmissionEntry({
      scope: EmissionScope.SCOPE_1,
      category: 'Mobile Combustion',
      source: 'Company Fleet',
      value: 340.2,
      unit: 'tCO2e',
      description: 'Diesel trucks and company cars',
      belongsToReportingPeriodId: org1Rp2024.id,
    }),
    new EmissionEntry({
      scope: EmissionScope.SCOPE_2,
      category: 'Purchased Electricity',
      source: 'Grid Electricity',
      value: 890.0,
      unit: 'tCO2e',
      description: null,
      belongsToReportingPeriodId: org1Rp2024.id,
    }),
    // Acme 2025
    new EmissionEntry({
      scope: EmissionScope.SCOPE_1,
      category: 'Stationary Combustion',
      source: 'Natural Gas Boiler',
      value: 1100.3,
      unit: 'tCO2e',
      description: 'Reduced consumption after insulation upgrade',
      belongsToReportingPeriodId: org1Rp2025.id,
    }),
    new EmissionEntry({
      scope: EmissionScope.SCOPE_2,
      category: 'Purchased Electricity',
      source: 'Grid Electricity',
      value: 720.0,
      unit: 'tCO2e',
      description: 'Partial switch to renewable tariff',
      belongsToReportingPeriodId: org1Rp2025.id,
    }),
    new EmissionEntry({
      scope: EmissionScope.SCOPE_1,
      category: 'Business travel',
      source: 'Company Car Travel',
      value: 62.4,
      unit: 'tCO2e',
      description: 'Fuel burned in company-owned vehicles on business trips',
      belongsToReportingPeriodId: org1Rp2025.id,
    }),
    // GreenTech 2024
    new EmissionEntry({
      scope: EmissionScope.SCOPE_1,
      category: 'Fugitive Emissions',
      source: 'Refrigerant Leakage',
      value: 45.8,
      unit: 'tCO2e',
      description: 'Server room cooling',
      belongsToReportingPeriodId: org2Rp2024.id,
    }),
    new EmissionEntry({
      scope: EmissionScope.SCOPE_2,
      category: 'Purchased Electricity',
      source: 'Grid Electricity',
      value: 210.5,
      unit: 'tCO2e',
      description: null,
      belongsToReportingPeriodId: org2Rp2024.id,
    }),
    // GreenTech 2025
    new EmissionEntry({
      scope: EmissionScope.SCOPE_2,
      category: 'Purchased Electricity',
      source: 'Green Electricity',
      value: 15.2,
      unit: 'tCO2e',
      description: '100% renewable energy contract',
      belongsToReportingPeriodId: org2Rp2025.id,
    }),
  ];

  await entryRepo.save(entries);
  console.log(`Created ${entries.length} emission entries`);

  await dataSource.destroy();
  console.log('Seed completed successfully');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
