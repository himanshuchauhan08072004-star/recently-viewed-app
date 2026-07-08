import request from 'supertest';
import app from '../app';
import { Product } from '../models/Product';

export async function createTestUser(emailSuffix = '1') {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: `user${emailSuffix}@example.com`,
      password: 'password123',
    });

  return {
    token: res.body.data.token as string,
    userId: res.body.data.user.id as string,
  };
}

export async function createTestProduct(overrides: Partial<Record<string, unknown>> = {}) {
  const product = await Product.create({
    name: 'Test Product',
    brand: 'TestBrand',
    image: 'https://example.com/image.jpg',
    price: 1000,
    discountPrice: 800,
    rating: 4.5,
    stock: 10,
    ...overrides,
  });
  return product;
}
