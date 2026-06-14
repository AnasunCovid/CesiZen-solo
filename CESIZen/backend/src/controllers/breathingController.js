const { validationResult } = require('express-validator');
const pool = require('../config/database');

const list = async (req, res) => {
  const onlyActive = req.user?.role !== 'admin';
  try {
    const where = onlyActive ? 'WHERE is_active = 1' : '';
    const [rows] = await pool.query(
      `SELECT * FROM breathing_exercises ${where} ORDER BY id ASC`
    );
    return res.json({ exercises: rows });
  } catch (err) {
    console.error('[breathing/list]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM breathing_exercises WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Exercice introuvable' });
    }
    return res.json({ exercise: rows[0] });
  } catch (err) {
    console.error('[breathing/getOne]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, label, inhale_duration, hold_duration = 0, exhale_duration, description } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO breathing_exercises
         (name, label, inhale_duration, hold_duration, exhale_duration, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, label, inhale_duration, hold_duration, exhale_duration, description]
    );

    const [created] = await pool.query(
      'SELECT * FROM breathing_exercises WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({ exercise: created[0] });
  } catch (err) {
    console.error('[breathing/create]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, label, inhale_duration, hold_duration, exhale_duration, description, is_active } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM breathing_exercises WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Exercice introuvable' });
    }

    const fields = [];
    const values = [];

    if (name            !== undefined) { fields.push('name = ?');            values.push(name); }
    if (label           !== undefined) { fields.push('label = ?');           values.push(label); }
    if (inhale_duration !== undefined) { fields.push('inhale_duration = ?'); values.push(inhale_duration); }
    if (hold_duration   !== undefined) { fields.push('hold_duration = ?');   values.push(hold_duration); }
    if (exhale_duration !== undefined) { fields.push('exhale_duration = ?'); values.push(exhale_duration); }
    if (description     !== undefined) { fields.push('description = ?');     values.push(description); }
    if (is_active       !== undefined) { fields.push('is_active = ?');       values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour' });
    }

    values.push(id);
    await pool.query(`UPDATE breathing_exercises SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query(
      'SELECT * FROM breathing_exercises WHERE id = ?',
      [id]
    );
    return res.json({ exercise: updated[0] });
  } catch (err) {
    console.error('[breathing/update]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM breathing_exercises WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exercice introuvable' });
    }
    return res.json({ message: 'Exercice supprimé' });
  } catch (err) {
    console.error('[breathing/remove]', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { list, getOne, create, update, remove };
