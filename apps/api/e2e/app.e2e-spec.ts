import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { AppModule } from '../src/app/app.module';
import { configureApp } from '../src/app/configure-app';

describe('API e2e smoke', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the organizations list over HTTP', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/organizations').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
