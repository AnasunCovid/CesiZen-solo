require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const pool = require('../config/database');

async function seed() {
  console.log('Démarrage du seed CESIZen…');

  const adminHash = await bcrypt.hash('Admin@cesizen1', 10);
  const userHash  = await bcrypt.hash('User@cesizen1',  10);

  await pool.query(
    `INSERT IGNORE INTO users (email, password_hash, first_name, last_name, role)
     VALUES (?, ?, 'Admin', 'CESIZen', 'admin')`,
    ['admin@cesizen.fr', adminHash]
  );

  await pool.query(
    `INSERT IGNORE INTO users (email, password_hash, first_name, last_name, role)
     VALUES (?, ?, 'Jean', 'Dupont', 'user')`,
    ['user@cesizen.fr', userHash]
  );

  console.log('✓ Utilisateurs créés :');
  console.log('  admin@cesizen.fr  /  Admin@cesizen1  (admin)');
  console.log('  user@cesizen.fr   /  User@cesizen1   (user)');
  console.log('\nSeed terminé. Exécutez database/seeds.sql pour les pages et exercices.');

  await pool.end();
}

seed().catch(err => {
  console.error('Erreur seed :', err);
  process.exit(1);
});
