/**
 * Tests unitaires et fonctionnels – Module Comptes Utilisateurs (Auth)
 * Couvre : inscription, connexion, accès à /me
 */

const request = require('supertest');
const pool = require('../src/config/database');
const app = require('../src/app');

beforeEach(async () => {
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

// ── Inscription ────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  const valid = {
    email: 'test@example.com',
    password: 'Test1234!',
    first_name: 'Alice',
    last_name: 'Martin',
  };

  test('TU-01 | Inscription valide → 201 + token', async () => {
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.role).toBe('user');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  test('TU-02 | Email déjà utilisé → 409', async () => {
    await request(app).post('/api/auth/register').send(valid);
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.status).toBe(409);
  });

  test('TU-03 | Email invalide → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...valid, email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  test('TU-04 | Mot de passe trop court → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...valid, password: 'abc' });
    expect(res.status).toBe(400);
  });

  test('TU-05 | Prénom manquant → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...valid, first_name: '' });
    expect(res.status).toBe(400);
  });
});

// ── Connexion ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      email: 'login@example.com',
      password: 'Login1234!',
      first_name: 'Bob',
      last_name: 'Dupont',
    });
  });

  test('TU-06 | Connexion valide → 200 + token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Login1234!',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('login@example.com');
  });

  test('TU-07 | Mauvais mot de passe → 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'WrongPass1!',
    });
    expect(res.status).toBe(401);
  });

  test('TU-08 | Email inexistant → 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'unknown@example.com',
      password: 'Login1234!',
    });
    expect(res.status).toBe(401);
  });
});

// ── /me ────────────────────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'me@example.com',
      password: 'Me1234567!',
      first_name: 'Carol',
      last_name: 'Bernard',
    });
    token = res.body.token;
  });

  test('TU-09 | Avec token valide → 200 + profil', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });

  test('TU-10 | Sans token → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('TU-11 | Token invalide → 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});

// ── Compte désactivé ───────────────────────────────────────────────────────────

describe('Compte désactivé', () => {
  test('TU-12 | Login compte désactivé → 403', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'inactive@example.com',
      password: 'Inactive1!',
      first_name: 'Dead',
      last_name: 'Account',
    });

    await pool.query(
      'UPDATE users SET is_active = 0 WHERE email = ?',
      ['inactive@example.com']
    );

    const res = await request(app).post('/api/auth/login').send({
      email: 'inactive@example.com',
      password: 'Inactive1!',
    });
    expect(res.status).toBe(403);
  });
});
