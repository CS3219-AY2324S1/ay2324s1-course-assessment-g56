import request from 'supertest';

import { server } from '../src/app';

describe('CORS Configuration', () => {
  it('should allow CORS with the correct origin', async () => {
    const allowedOrigin = process.env.FRONTEND_SERVICE;

    if (!allowedOrigin) {
      fail('Environment Variable FRONTEND_SERVICE not set up properly');
    }

    const response = await request(server)
      .get('/user')
      .set('Origin', allowedOrigin);

    expect(response.header['access-control-allow-origin']).toBe(allowedOrigin);
    expect(response.header['access-control-allow-credentials']).toBe('true');
    expect(response.status).toBe(200);
  });

  it('should not allow CORS with an incorrect origin', async () => {
    const wrongOrigin = 'http://localhost:8000';

    const response = await request(server)
      .get('/user')
      .set('Origin', wrongOrigin);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Access to this resource is forbidden');
  });

  afterAll(() => {
    server.close();
  });
});
