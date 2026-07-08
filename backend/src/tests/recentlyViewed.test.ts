import request from 'supertest';
import app from '../app';
import { createTestUser, createTestProduct } from './helpers';

describe('Recently Viewed API', () => {
  it('rejects request without token', async () => {
    const res = await request(app).get('/api/recently-viewed');
    expect(res.status).toBe(401);
  });

  it('rejects request with malformed token', async () => {
    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', 'Bearer garbage-token');
    expect(res.status).toBe(401);
  });

  it('records a product view', async () => {
    const { token } = await createTestUser();
    const product = await createTestProduct();

    const res = await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id });

    expect(res.status).toBe(201);
    expect(res.body.data.productId.toString()).toBe(product.id);
  });

  it('rejects viewing a product that does not exist', async () => {
    const { token } = await createTestUser();
    const fakeId = '64f000000000000000000000';

    const res = await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: fakeId });

    expect(res.status).toBe(404);
  });

  it('does not create duplicates when the same product is viewed twice', async () => {
    const { token } = await createTestUser();
    const product = await createTestProduct();

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id });

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id });

    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).toHaveLength(1);
  });

  it('moves a re-viewed product to the top of the list', async () => {
    const { token } = await createTestUser();
    const productA = await createTestProduct({ name: 'A' });
    const productB = await createTestProduct({ name: 'B' });

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: productA.id });

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: productB.id });

    // Re-view A — it should now be first.
    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: productA.id });

    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data[0].productId.name).toBe('A');
    expect(res.body.data[1].productId.name).toBe('B');
  });

  it('caps history at 20 items, dropping the oldest', async () => {
    const { token } = await createTestUser();

    const products = await Promise.all(
      Array.from({ length: 22 }).map((_, i) => createTestProduct({ name: `P${i}` }))
    );

    for (const product of products) {
      await request(app)
        .post('/api/recently-viewed')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id });
    }

    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).toHaveLength(20);
    // Oldest two (P0, P1) should have been trimmed; newest (P21) should be first.
    expect(res.body.data[0].productId.name).toBe('P21');
    const names = res.body.data.map((d: any) => d.productId.name);
    expect(names).not.toContain('P0');
    expect(names).not.toContain('P1');
  });

  it('removes a single item from history', async () => {
    const { token } = await createTestUser();
    const product = await createTestProduct();

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id });

    const del = await request(app)
      .delete(`/api/recently-viewed/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(200);

    const res = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).toHaveLength(0);
  });

  it('returns 404 when removing an item not in history', async () => {
    const { token } = await createTestUser();
    const product = await createTestProduct();

    const res = await request(app)
      .delete(`/api/recently-viewed/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('keeps each user history isolated from other users', async () => {
    const userA = await createTestUser('a');
    const userB = await createTestUser('b');
    const product = await createTestProduct();

    await request(app)
      .post('/api/recently-viewed')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ productId: product.id });

    const resB = await request(app)
      .get('/api/recently-viewed')
      .set('Authorization', `Bearer ${userB.token}`);

    expect(resB.body.data).toHaveLength(0);
  });
});
