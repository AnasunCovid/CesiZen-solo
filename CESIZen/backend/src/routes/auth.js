const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

const emailRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
];

const passwordRule = body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
  .withMessage('Mot de passe : 8 caractères min, 1 majuscule, 1 chiffre, 1 caractère spécial');

router.post('/register', [
  ...emailRules,
  passwordRule,
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
], ctrl.register);

router.post('/login', [
  ...emailRules,
  body('password').notEmpty().withMessage('Mot de passe requis'),
], ctrl.login);

router.get('/me', auth, ctrl.me);

module.exports = router;
