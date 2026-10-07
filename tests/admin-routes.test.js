import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import test from 'node:test';
import { createMarketplaceRouter } from '../routes/marketplace.js';

const createErrorResponse = (res, status, code, message) => res.status(status).json({
  success: false,
  error: { code, message }
});

const createTestServer = async (query) => {
  const app = express();
  app.use(express.json());
  app.use('/api', createMarketplaceRouter({
    query,
    pool: {},
    createErrorResponse,
    requireAuth: (req, res, next) => {
      const role = req.get('authorization')?.replace('Bearer ', '');
      if (!role) return createErrorResponse(res, 401, 'UNAUTHORIZED', 'A valid bearer token is required');
      req.user = { id: 'test-user', userType: role };
      return next();
    }
  }));
  const server = app.listen(0);
  await once(server, 'listening');
  return {
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}/api`,
    close: async () => {
      server.closeAllConnections();
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  };
};

test('admin dashboard requires authentication and admin role', async t => {
  const app = await createTestServer(async () => ({ rows: [] }));
  t.after(app.close);

  const anonymous = await fetch(`${app.baseUrl}/admin/dashboard`);
  assert.equal(anonymous.status, 401);

  const family = await fetch(`${app.baseUrl}/admin/dashboard`, {
    headers: { Authorization: 'Bearer family' }
  });
  assert.equal(family.status, 403);
});

test('admin dashboard returns summary, caregivers, and reviews', async t => {
  const summary = { totalUsers: 4, totalCaregivers: 2, pendingCaregivers: 1, pendingReviews: 1 };
  const caregiver = { id: 'caregiver-1', fullName: 'Test Caregiver', isVerified: false };
  const review = { id: 'review-1', reviewerName: 'Test Family', isVerified: false };
  const app = await createTestServer(async sql => {
    if (sql.includes('"totalUsers"')) return { rows: [summary] };
    if (sql.includes('FROM caregiver_profiles c')) return { rows: [caregiver] };
    if (sql.includes('FROM reviews r')) return { rows: [review] };
    throw new Error(`Unexpected query: ${sql}`);
  });
  t.after(app.close);

  const response = await fetch(`${app.baseUrl}/admin/dashboard`, {
    headers: { Authorization: 'Bearer admin' }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    summary,
    caregivers: [caregiver],
    reviews: [review]
  });
});

test('review moderation validates status and persists the admin decision', async t => {
  const updates = [];
  const app = await createTestServer(async (sql, values) => {
    if (!sql.startsWith('UPDATE reviews')) throw new Error(`Unexpected query: ${sql}`);
    updates.push(values);
    return { rows: [{ id: values[0], isVerified: values[1] }] };
  });
  t.after(app.close);

  const invalid = await fetch(`${app.baseUrl}/admin/reviews/review-1/verification`, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer admin', 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_verified: 'false' })
  });
  assert.equal(invalid.status, 400);
  assert.equal(updates.length, 0);

  const response = await fetch(`${app.baseUrl}/admin/reviews/review-1/verification`, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer admin', 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_verified: false })
  });
  assert.equal(response.status, 200);
  assert.deepEqual(updates, [['review-1', false]]);
});
