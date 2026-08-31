import { describe, expect, it } from 'vitest';
import { testing } from 'ts_scenario';
import { EmissionScope } from '@interview/common';
import { catalog } from './catalog';
import { defaultScenario } from './default.scenario';

describe('default scenario (netcero-base)', () => {
  it('materializes all three resource kinds with resolved parent links', async () => {
    const registry = testing.createMemoryRegistry(catalog);
    const result = await testing.runOrThrow(registry, [
      catalog.organizations.acme,
      catalog.organizations.greentech,
      catalog.reportingPeriods.acme2024,
      catalog.reportingPeriods.acme2025,
      catalog.reportingPeriods.greentech2024,
      catalog.reportingPeriods.greentech2025,
      catalog.emissionEntries.acme2024_stationary,
      catalog.emissionEntries.acme2024_mobile,
      catalog.emissionEntries.acme2024_electricity,
      catalog.emissionEntries.acme2025_stationary,
      catalog.emissionEntries.acme2025_electricity,
      catalog.emissionEntries.acme2025_travel,
      catalog.emissionEntries.greentech2024_fugitive,
      catalog.emissionEntries.greentech2024_electricity,
      catalog.emissionEntries.greentech2025_electricity,
    ]);

    const resources = new Set(result.entries().map(([key]) => key.split(':')[0]));
    expect(resources).toContain('organizations');
    expect(resources).toContain('reportingPeriods');
    expect(resources).toContain('emissionEntries');

    expect(
      result.entries().filter(([key]) => key.startsWith('organizations:')).length,
    ).toBe(2);
    expect(
      result.entries().filter(([key]) => key.startsWith('reportingPeriods:')).length,
    ).toBe(4);
    expect(
      result.entries().filter(([key]) => key.startsWith('emissionEntries:')).length,
    ).toBe(9);

    testing.assertCreated(result, catalog.emissionEntries.acme2025_travel);
    testing.assertAttr(
      result,
      catalog.emissionEntries.acme2025_travel,
      'scope',
      EmissionScope.SCOPE_3,
    );

    const org = result.mustGet(catalog.organizations.acme.ref);
    const period = result.mustGet(catalog.reportingPeriods.acme2025.ref);
    const travel = result.mustGet(catalog.emissionEntries.acme2025_travel.ref);

    expect(period.orgId).toBe(org.id);
    expect(travel.reportingPeriodId).toBe(period.id);

    // runScenario should produce an equivalent result via the full scenario path
    const scenarioRegistry = testing.createMemoryRegistry(catalog);
    const scenarioResult = await scenarioRegistry.runScenario(defaultScenario);
    const scenarioTravel = scenarioResult.mustGet(
      catalog.emissionEntries.acme2025_travel.ref,
    );
    expect(scenarioTravel.scope).toBe(EmissionScope.SCOPE_3);
    expect(scenarioTravel.reportingPeriodId).toBe(
      scenarioResult.mustGet(catalog.reportingPeriods.acme2025.ref).id,
    );
  });
});
