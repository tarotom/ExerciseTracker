import request from 'supertest';
import { initializeDb } from '../utils/db'; // Ensure the DB is initialized
import app from '../app'; // Your Express app
import db from '../utils/db'; // Your SQLite DB instance

beforeAll(async () => {
    await initializeDb();
});

beforeEach(async () => {
    await db.run(`DELETE FROM Exercises`);
});

describe('POST /exercises', () => {
  it('should create a new exercise', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({ name: 'Bench Press' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Exercise created');
  });

  it('should not allow missing name', async () => {
    const response = await request(app)
      .post('/exercises')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });

  it('should not allow duplicate name', async () => {
    // First insert (should pass)
    await request(app).post('/exercises').send({ name: 'Squat' });

    // Second insert (should fail)
    const response = await request(app)
      .post('/exercises')
      .send({ name: 'Squat' });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/already exists/i);
  });
});
