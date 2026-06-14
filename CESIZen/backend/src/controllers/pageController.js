const { validationResult } = require('express-validator');
const pool = require('../config/database');

const list = async (req, res) => {
  const onlyPublished = req.user?.role !== 'admin';
  try {
    const where = onlyPublished ? 'WHERE is_published = 1' : '';
    const [rows] = await pool.query(
      `SELECT id, title, slug, excerpt, is_published, parent_id, position, created_at
       FROM pages ${where}
       ORDER BY position ASC, created_at ASC`
    );
    return res.json({ pages: rows });
  } catch (err) {
    console.error('[pages/list]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getBySlug = async (req, res) => {
  const { slug } = req.params;
  const onlyPublished = req.user?.role !== 'admin';

  try {
    const where = onlyPublished
      ? 'WHERE slug = ? AND is_published = 1'
      : 'WHERE slug = ?';

    const [rows] = await pool.query(
      `SELECT p.*, u.first_name AS author_first, u.last_name AS author_last
       FROM pages p
       LEFT JOIN users u ON p.created_by = u.id
       ${where}`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Page introuvable' });
    }
    return res.json({ page: rows[0] });
  } catch (err) {
    console.error('[pages/getBySlug]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pages WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Page introuvable' });
    }
    return res.json({ page: rows[0] });
  } catch (err) {
    console.error('[pages/getById]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, slug, content, excerpt, is_published = true, parent_id = null, position = 0 } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM pages WHERE slug = ?',
      [slug]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ce slug est déjà utilisé' });
    }

    const [result] = await pool.query(
      `INSERT INTO pages (title, slug, content, excerpt, is_published, parent_id, position, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt, is_published ? 1 : 0, parent_id, position, req.user.id, req.user.id]
    );

    const [created] = await pool.query(
      'SELECT * FROM pages WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({ page: created[0] });
  } catch (err) {
    console.error('[pages/create]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, excerpt, is_published, parent_id, position } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM pages WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Page introuvable' });
    }

    if (slug) {
      const [slugCheck] = await pool.query(
        'SELECT id FROM pages WHERE slug = ? AND id != ?',
        [slug, id]
      );
      if (slugCheck.length > 0) {
        return res.status(409).json({ message: 'Ce slug est déjà utilisé' });
      }
    }

    const fields = [];
    const values = [];

    if (title        !== undefined) { fields.push('title = ?');        values.push(title); }
    if (slug         !== undefined) { fields.push('slug = ?');         values.push(slug); }
    if (content      !== undefined) { fields.push('content = ?');      values.push(content); }
    if (excerpt      !== undefined) { fields.push('excerpt = ?');      values.push(excerpt); }
    if (is_published !== undefined) { fields.push('is_published = ?'); values.push(is_published ? 1 : 0); }
    if (parent_id    !== undefined) { fields.push('parent_id = ?');    values.push(parent_id); }
    if (position     !== undefined) { fields.push('position = ?');     values.push(position); }

    fields.push('updated_by = ?');
    values.push(req.user.id);
    values.push(id);

    await pool.query(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM pages WHERE id = ?', [id]);
    return res.json({ page: updated[0] });
  } catch (err) {
    console.error('[pages/update]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM pages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page introuvable' });
    }
    return res.json({ message: 'Page supprimée' });
  } catch (err) {
    console.error('[pages/remove]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { list, getBySlug, getById, create, update, remove };
