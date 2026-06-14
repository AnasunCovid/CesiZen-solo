require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'CESIZen API' }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/profile',   require('./routes/profile'));
app.use('/api/pages',     require('./routes/pages'));
app.use('/api/breathing', require('./routes/breathing'));

app.use((_req, res) => res.status(404).json({ message: 'Route introuvable' }));

app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

module.exports = app;
