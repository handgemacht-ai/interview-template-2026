import { defineCatalog, definePrototypes, ref } from 'ts_scenario';
import { EmissionScope } from '@interview/common';
import './schema';

const organizations = definePrototypes('organizations', {
  acme: { name: 'Acme Manufacturing GmbH' },
  greentech: { name: 'GreenTech Solutions AG' },
});

const reportingPeriods = definePrototypes('reportingPeriods', {
  acme2024: {
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    orgId: ref('organizations', 'acme'),
  },
  acme2025: {
    year: 2025,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    orgId: ref('organizations', 'acme'),
  },
  greentech2024: {
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    orgId: ref('organizations', 'greentech'),
  },
  greentech2025: {
    year: 2025,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    orgId: ref('organizations', 'greentech'),
  },
});

const emissionEntries = definePrototypes('emissionEntries', {
  acme2024_stationary: {
    scope: EmissionScope.SCOPE_1,
    category: 'Stationary Combustion',
    source: 'Natural Gas Boiler',
    value: 1250.5,
    unit: 'tCO2e',
    description: 'Main facility heating',
    reportingPeriodId: ref('reportingPeriods', 'acme2024'),
  },
  acme2024_mobile: {
    scope: EmissionScope.SCOPE_1,
    category: 'Mobile Combustion',
    source: 'Company Fleet',
    value: 340.2,
    unit: 'tCO2e',
    description: 'Diesel trucks and company cars',
    reportingPeriodId: ref('reportingPeriods', 'acme2024'),
  },
  acme2024_electricity: {
    scope: EmissionScope.SCOPE_2,
    category: 'Purchased Electricity',
    source: 'Grid Electricity',
    value: 890.0,
    unit: 'tCO2e',
    description: null,
    reportingPeriodId: ref('reportingPeriods', 'acme2024'),
  },
  acme2025_stationary: {
    scope: EmissionScope.SCOPE_1,
    category: 'Stationary Combustion',
    source: 'Natural Gas Boiler',
    value: 1100.3,
    unit: 'tCO2e',
    description: 'Reduced consumption after insulation upgrade',
    reportingPeriodId: ref('reportingPeriods', 'acme2025'),
  },
  acme2025_electricity: {
    scope: EmissionScope.SCOPE_2,
    category: 'Purchased Electricity',
    source: 'Grid Electricity',
    value: 720.0,
    unit: 'tCO2e',
    description: 'Partial switch to renewable tariff',
    reportingPeriodId: ref('reportingPeriods', 'acme2025'),
  },
  acme2025_travel: {
    scope: EmissionScope.SCOPE_1,
    category: 'Business travel',
    source: 'Company Car Travel',
    value: 62.4,
    unit: 'tCO2e',
    description: 'Fuel burned in company-owned vehicles on business trips',
    reportingPeriodId: ref('reportingPeriods', 'acme2025'),
  },
  greentech2024_fugitive: {
    scope: EmissionScope.SCOPE_1,
    category: 'Fugitive Emissions',
    source: 'Refrigerant Leakage',
    value: 45.8,
    unit: 'tCO2e',
    description: 'Server room cooling',
    reportingPeriodId: ref('reportingPeriods', 'greentech2024'),
  },
  greentech2024_electricity: {
    scope: EmissionScope.SCOPE_2,
    category: 'Purchased Electricity',
    source: 'Grid Electricity',
    value: 210.5,
    unit: 'tCO2e',
    description: null,
    reportingPeriodId: ref('reportingPeriods', 'greentech2024'),
  },
  greentech2025_electricity: {
    scope: EmissionScope.SCOPE_2,
    category: 'Purchased Electricity',
    source: 'Green Electricity',
    value: 15.2,
    unit: 'tCO2e',
    description: '100% renewable energy contract',
    reportingPeriodId: ref('reportingPeriods', 'greentech2025'),
  },
});

export const catalog = defineCatalog({
  organizations,
  reportingPeriods,
  emissionEntries,
});
