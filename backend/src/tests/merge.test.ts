import request from 'supertest';
import app from '../app';
import { createTestUser, createTestProduct } from './helpers';

describe('Merge Guest History API', () => {
  it('merges guest items into empty server history', async () => {
    const { token } = await createTestUser();
    const productA = await createTestProduct({ name: 'A' });
    const productB = await createTestProduct({ name: 'B' });

    const res = await request(app)
      .post('/api/recently-viewed/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId: productA.id, viewedAt: new Date(Date.now() - 1000).toISOString() },
          { productId: productB.id, viewedAt: new Date().toISOString() },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].productId.name).toBe('B');
  });

  it('preserves the newest timestamp when merging a product that already exists server-side', async () => {
    const { token } = await createTestUser();
    const product = await createTestProduct();

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id });

    const olderTimestamp = new Date(Date.now() - 100000).toISOString();
    await request(app)
      .post('/api/recently-viewed/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: product.id, viewedAt: olderTimestamp }] });

    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).toHaveLength(1);
    expect(new Date(res.body.data[0].viewedAt).getTime()).toBeGreaterThan(
      new Date(olderTimestamp).getTime()
    );
  });

  it('accepts merge payload at the 20-item limit and stores all of them', async () => {
    const { token } = await createTestUser();
    const products = await Promise.all(
      Array.from({ length: 20 }).map((_, i) => createTestProduct({ name: `M${i}` }))
    );

    const items = products.map((p, i) => ({
      productId: p.id,
      viewedAt: new Date(Date.now() - i * 1000).toISOString(),
    }));

    const res = await request(app)
      .post('/api/recently-viewed/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(20);
  });

  it('trims combined total to 20 when server already has history before merging', async () => {
    const { token } = await createTestUser();

    const serverProducts = await Promise.all(
      Array.from({ length: 15 }).map((_, i) => createTestProduct({ name: `S${i}` }))
    );
    for (const p of serverProducts) {
      await request(app)
        .post('/api/recently-viewed')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: p.id });
    }

    const guestProducts = await Promise.all(
      Array.from({ length: 10 }).map((_, i) => createTestProduct({ name: `G${i}` }))
    );
    const items = guestProducts.map((p, i) => ({
      productId: p.id,
      viewedAt: new Date(Date.now() + 1000 - i * 10).toISOString(),
    }));

    const res = await request(app)
      .post('/api/recently-viewed/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(20);
    const names = res.body.data.map((d: any) => d.productId.name);
    guestProducts.forEach((p) => expect(names).toContain(p.name));
  });

  it('rejects a merge payload with more than 20 items', async () => {
    const { token } = await createTestUser();
    const items = Array.from({ length: 21 }).map(() => ({
      productId: '64f000000000000000000000',
      viewedAt: new Date().toISOString(),
    }));

    const res = await request(app)
      .post('/api/recently-viewed/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items });

    expect(res.status).toBe(400);
  });
});