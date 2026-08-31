import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { AppModule } from '../src/app/app.module';
import { configureApp } from '../src/app/configure-app';
import { createDataSource } from '../src/database/data-source';
import { createNetCeroRegistry } from '../src/database/registry';
import { defaultScenario } from '../src/database/scenarios/default.scenario';
import { EmissionEntry } from '../src/domain/emission-entries/emission-entry.entity';
import { ReportingPeriod } from '../src/domain/reporting-periods/reporting-period.entity';
import { Organization } from '../src/domain/organizations/organization.entity';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_8601_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

const EXPECTED_ORG_NAMES = ['Acme Manufacturing GmbH', 'GreenTech Solutions AG'];

describe('GET /api/v1/organizations — default scenario', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dataSource = createDataSource();
    await dataSource.initialize();

    await dataSource.getRepository(EmissionEntry).createQueryBuilder().delete().execute();
    await dataSource.getRepository(ReportingPeriod).createQueryBuilder().delete().execute();
    await dataSource.getRepository(Organization).createQueryBuilder().delete().execute();

    const registry = createNetCeroRegistry(dataSource);
    await registry.runScenario(defaultScenario, { runCtx: { source: 'seed' } });

    await dataSource.destroy();

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the seeded organizations with the exact IOrganization JSON shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/organizations')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(EXPECTED_ORG_NAMES.length);

    const returnedNames: string[] = res.body.map((org: unknown) => (org as { name: string }).name);
    expect(returnedNames.sort()).toEqual([...EXPECTED_ORG_NAMES].sort());

    for (const org of res.body as Array<Record<string, unknown>>) {
      expect(Object.keys(org).sort()).toEqual(['createdAt', 'id', 'name', 'updatedAt']);

      expect(typeof org.id).toBe('string');
      expect(org.id).toMatch(UUID_RE);

      expect(typeof org.name).toBe('string');
      expect(EXPECTED_ORG_NAMES).toContain(org.name);

      expect(typeof org.createdAt).toBe('string');
      expect(org.createdAt).toMatch(ISO_8601_RE);

      expect(typeof org.updatedAt).toBe('string');
      expect(org.updatedAt).toMatch(ISO_8601_RE);
    }
  });
});
