const mysql = require('mysql2/promise');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT)  || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database: isTest
    ? (process.env.DB_NAME_TEST || 'cesizen_test')
    : (process.env.DB_NAME      || 'cesizen'),
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:           'utf8mb4',
  timezone:          '+00:00',
});

module.exports = pool;
