const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

const SALT_ROUNDS = 10;

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role, created_at
       FROM users WHERE id = ? AND is_active = 1`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profil introuvable' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[profile/get]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name } = req.body;

  try {
    await pool.query(
      `UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`,
      [first_name.trim(), last_name.trim(), req.user.id]
    );

    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role FROM users WHERE id = ?`,
      [req.user.id]
    );

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[profile/update]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { current_password, new_password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    const hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hash, req.user.id]
    );

    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('[profile/changePassword]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
