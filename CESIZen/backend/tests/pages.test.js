/**
 * Tests fonctionnels et non-régression – Module Informations (Pages)
 */

const request = require('supertest');
const pool = require('../src/config/database');
const app = require('../src/app');

let adminToken;

beforeAll(async () => {
  await pool.query('DELETE FROM pages');
  await pool.query('DELETE FROM users');

  await request(app).post('/api/auth/register').send({
    email: 'admin_p@test.fr', password: 'Admin1234!',
    first_name: 'Admin', last_name: 'Pages',
  });
  await pool.query("UPDATE users SET role='admin' WHERE email='admin_p@test.fr'");
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin_p@test.fr', password: 'Admin1234!',
  });
  adminToken = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe('POST /api/pages (admin)', () => {
  test('TF-P01 | Créer une page valide → 201', async () => {
    const res = await request(app)
      .post('/api/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Test Page', slug: 'test-page', content: '<p>Contenu</p>' });
    expect(res.status).toBe(201);
    expect(res.body.page.slug).toBe('test-page');
  });

  test('TF-P02 | Slug dupliqué → 409', async () => {
    const res = await request(app)
      .post('/api/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Autre', slug: 'test-page' });
    expect(res.status).toBe(409);
  });

  test('TF-P03 | Slug avec majuscule invalide → 400', async () => {
    const res = await request(app)
      .post('/api/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Bad', slug: 'Bad-Slug' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/pages/slug/:slug (public)', () => {
  test('TF-P04 | Page publiée accessible → 200', async () => {
    const res = await request(app).get('/api/pages/slug/test-page');
    expect(res.status).toBe(200);
    expect(res.body.page.title).toBe('Test Page');
  });

  test('TF-P05 | Page inexistante → 404', async () => {
    const res = await request(app).get('/api/pages/slug/inexistante');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/pages/:id (admin)', () => {
  let pageId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'À modifier', slug: 'a-modifier' });
    pageId = res.body.page.id;
  });

  test('TF-P06 | Mise à jour titre → 200', async () => {
    const res = await request(app)
      .put(`/api/pages/${pageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Titre modifié' });
    expect(res.status).toBe(200);
    expect(res.body.page.title).toBe('Titre modifié');
  });

  test('TF-P07 | Dépublication → is_published = 0', async () => {
    const res = await request(app)
      .put(`/api/pages/${pageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ is_published: false });
    expect(res.status).toBe(200);
    expect(res.body.page.is_published).toBe(0);
  });

  test('TNR-P01 | Page dépubliée absente de la liste publique', async () => {
    const res = await request(app).get('/api/pages');
    const found = res.body.pages.find(p => p.id === pageId);
    expect(found).toBeUndefined();
  });
});

describe('DELETE /api/pages/:id (admin)', () => {
  test('TF-P08 | Suppression page → 200', async () => {
    const create = await request(app)
      .post('/api/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'À supprimer', slug: 'a-supprimer' });

    const res = await request(app)
      .delete(`/api/pages/${create.body.page.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
