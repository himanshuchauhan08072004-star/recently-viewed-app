import request from 'supertest';
import app from '../app';
import { Order } from '../models/Order';
import { createTestUser, createTestProduct } from './helpers';

describe('Continue Shopping API', () => {
  it('excludes purchased products from the list', async () => {
    const { token, userId } = await createTestUser();
    const viewedOnly = await createTestProduct({ name: 'ViewedOnly' });
    const purchased = await createTestProduct({ name: 'Purchased' });

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: viewedOnly.id });

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: purchased.id });

    await Order.create({
      userId,
      productIds: [purchased.id],
      status: 'completed',
    });

    const res = await request(app)
      .get('/api/continue-shopping')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const names = res.body.data.map((d: any) => d.productId.name);
    expect(names).toContain('ViewedOnly');
    expect(names).not.toContain('Purchased');
  });

  it('returns an empty list when nothing has been viewed', async () => {
    const { token } = await createTestUser();

    const res = await request(app)
      .get('/api/continue-shopping')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/continue-shopping');
    expect(res.status).toBe(401);
  });
});
