const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  const db = process.env.DB_NAME_TEST || 'cesizen_test';
  await conn.query(`DROP DATABASE IF EXISTS \`${db}\``);
  await conn.end();
};
