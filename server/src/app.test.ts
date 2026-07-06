import { describe, expect, it } from 'vitest';
import request from 'supertest';

process.env.DATABASE_URL = 'postgresql://aegis:aegis@localhost:5432/aegis';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-with-at-least-thirty-two-characters';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-with-at-least-thirty-two-characters';

describe('AEGIS API', () => {
  it('exposes a health endpoint', async () => {
    const { createApp } = await import('./app.js');
    const response = await request(createApp()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
