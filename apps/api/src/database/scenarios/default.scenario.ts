import { defineScenario } from 'ts_scenario';
import { catalog } from './catalog';

export const defaultScenario = defineScenario(catalog, {
  name: 'netcero-base',
  prototypes: {
    organizations: {
      acme: {},
      greentech: {},
    },
    reportingPeriods: {
      acme2024: {},
      acme2025: {},
      greentech2024: {},
      greentech2025: {},
    },
    emissionEntries: {
      acme2024_stationary: {},
      acme2024_mobile: {},
      acme2024_electricity: {},
      acme2025_stationary: {},
      acme2025_electricity: {},
      acme2025_travel: {},
      greentech2024_fugitive: {},
      greentech2024_electricity: {},
      greentech2025_electricity: {},
    },
  },
});
