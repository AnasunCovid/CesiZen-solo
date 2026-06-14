/**
 * Tests unitaires, fonctionnels et non-régression – Module Exercices de Respiration
 */

const request = require('supertest');
const pool = require('../src/config/database');
const app = require('../src/app');

let adminToken;
let userToken;

const registerAndLogin = async (email, pwd, isAdmin = false) => {
  await request(app).post('/api/auth/register').send({
    email, password: pwd, first_name: 'Test', last_name: 'User',
  });
  if (isAdmin) {
    await pool.query("UPDATE users SET role='admin' WHERE email=?", [email]);
  }
  const res = await request(app).post('/api/auth/login').send({ email, password: pwd });
  return res.body.token;
};

beforeAll(async () => {
  await pool.query('DELETE FROM breathing_exercises');
  await pool.query('DELETE FROM users');
  adminToken = await registerAndLogin('admin_b@test.fr', 'Admin1234!', true);
  userToken  = await registerAndLogin('user_b@test.fr',  'User1234!',  false);
});

afterAll(async () => {
  await pool.end();
});

// ── CRUD Admin ────────────────────────────────────────────────────────────────

describe('POST /api/breathing (admin)', () => {
  test('TU-B01 | Créer un exercice valide → 201', async () => {
    const res = await request(app)
      .post('/api/breathing')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test 5-5', label: '5-5',
        inhale_duration: 5, hold_duration: 0, exhale_duration: 5,
        description: 'Test',
      });
    expect(res.status).toBe(201);
    expect(res.body.exercise.label).toBe('5-5');
  });

  test('TU-B02 | Durée invalide (0s) → 400', async () => {
    const res = await request(app)
      .post('/api/breathing')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Bad', label: 'x', inhale_duration: 0, exhale_duration: 5 });
    expect(res.status).toBe(400);
  });

  test('TU-B03 | Sans token → 401', async () => {
    const res = await request(app)
      .post('/api/breathing')
      .send({ name: 'X', label: 'X', inhale_duration: 4, exhale_duration: 6 });
    expect(res.status).toBe(401);
  });

  test('TU-B04 | Utilisateur non-admin → 403', async () => {
    const res = await request(app)
      .post('/api/breathing')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'X', label: 'X', inhale_duration: 4, exhale_duration: 6 });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/breathing (public)', () => {
  test('TF-B01 | Liste des exercices actifs → 200', async () => {
    const res = await request(app).get('/api/breathing');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.exercises)).toBe(true);
  });
});

describe('PUT /api/breathing/:id (admin)', () => {
  let exerciseId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/breathing')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Edit me', label: '4-6', inhale_duration: 4, exhale_duration: 6 });
    exerciseId = res.body.exercise.id;
  });

  test('TU-B05 | Mise à jour description → 200', async () => {
    const res = await request(app)
      .put(`/api/breathing/${exerciseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Mise à jour' });
    expect(res.status).toBe(200);
    expect(res.body.exercise.description).toBe('Mise à jour');
  });

  test('TU-B06 | Désactivation → is_active = 0', async () => {
    const res = await request(app)
      .put(`/api/breathing/${exerciseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ is_active: false });
    expect(res.status).toBe(200);
    expect(res.body.exercise.is_active).toBe(0);
  });

  test('TNR-B01 | Exercice désactivé absent de la liste publique', async () => {
    const res = await request(app).get('/api/breathing');
    const found = res.body.exercises.find(e => e.id === exerciseId);
    expect(found).toBeUndefined();
  });
});

describe('DELETE /api/breathing/:id (admin)', () => {
  let deleteId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/breathing')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Delete me', label: 'del', inhale_duration: 3, exhale_duration: 3 });
    deleteId = res.body.exercise.id;
  });

  test('TU-B07 | Suppression exercice → 200', async () => {
    const res = await request(app)
      .delete(`/api/breathing/${deleteId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  test('TNR-B02 | Exercice supprimé introuvable → 404', async () => {
    const res = await request(app).get(`/api/breathing/${deleteId}`);
    expect(res.status).toBe(404);
  });
});
