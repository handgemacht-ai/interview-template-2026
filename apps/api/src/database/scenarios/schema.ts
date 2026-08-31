import type { Link } from 'ts_scenario';
import type { EmissionScope } from '@interview/common';

declare module 'ts_scenario' {
  interface TsScenarioResources {
    organizations: {
      input: { name: string };
      record: { id: string; name: string };
    };
    reportingPeriods: {
      input: {
        year: number;
        startDate: string;
        endDate: string;
        orgId: Link<'organizations'>;
      };
      record: {
        id: string;
        year: number;
        startDate: Date;
        endDate: Date;
        orgId: string;
      };
    };
    emissionEntries: {
      input: {
        scope: EmissionScope;
        category: string;
        source: string;
        value: number;
        unit: string;
        description: string | null;
        reportingPeriodId: Link<'reportingPeriods'>;
      };
      record: {
        id: string;
        scope: EmissionScope;
        category: string;
        source: string;
        value: number;
        unit: string;
        description: string | null;
        reportingPeriodId: string;
      };
    };
  }
}
