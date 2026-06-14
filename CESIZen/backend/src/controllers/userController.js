const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

const SALT_ROUNDS = 10;

const list = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at
       FROM users ORDER BY created_at DESC`
    );
    return res.json({ users: rows });
  } catch (err) {
    console.error('[users/list]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at
       FROM users WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[users/getOne]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, first_name, last_name, role = 'user' } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)`,
      [email.toLowerCase(), hash, first_name.trim(), last_name.trim(), role]
    );

    const [created] = await pool.query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ user: created[0] });
  } catch (err) {
    console.error('[users/create]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const PROTECTED_ADMIN = 'admin@cesizen.fr';

const update = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, role, is_active } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id, email FROM users WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Empêche de rétrograder ou désactiver le compte administrateur principal
    if (existing[0].email === PROTECTED_ADMIN) {
      if (role !== undefined && role !== 'admin') {
        return res.status(403).json({ message: 'Le compte administrateur principal ne peut pas être rétrogradé.' });
      }
      if (is_active !== undefined && !is_active) {
        return res.status(403).json({ message: 'Le compte administrateur principal ne peut pas être désactivé.' });
      }
    }

    const fields = [];
    const values = [];

    if (first_name !== undefined) { fields.push('first_name = ?'); values.push(first_name.trim()); }
    if (last_name  !== undefined) { fields.push('last_name = ?');  values.push(last_name.trim()); }
    if (role       !== undefined) { fields.push('role = ?');       values.push(role); }
    if (is_active  !== undefined) { fields.push('is_active = ?');  values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour' });
    }

    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await pool.query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at
       FROM users WHERE id = ?`,
      [id]
    );

    return res.json({ user: updated[0] });
  } catch (err) {
    console.error('[users/update]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deactivate = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Impossible de désactiver votre propre compte' });
  }

  try {
    const [target] = await pool.query('SELECT email FROM users WHERE id = ?', [id]);
    if (target.length > 0 && target[0].email === PROTECTED_ADMIN) {
      return res.status(403).json({ message: 'Le compte administrateur principal ne peut pas être désactivé.' });
    }

    const [result] = await pool.query(
      'UPDATE users SET is_active = 0 WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json({ message: 'Compte désactivé' });
  } catch (err) {
    console.error('[users/deactivate]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Impossible de supprimer votre propre compte' });
  }

  try {
    const [target] = await pool.query('SELECT email FROM users WHERE id = ?', [id]);
    if (target.length > 0 && target[0].email === PROTECTED_ADMIN) {
      return res.status(403).json({ message: 'Le compte administrateur principal ne peut pas être supprimé.' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json({ message: 'Compte supprimé' });
  } catch (err) {
    console.error('[users/remove]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { list, getOne, create, update, deactivate, remove };
