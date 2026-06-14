const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', ctrl.getProfile);

router.put('/', [
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
], ctrl.updateProfile);

router.put('/password', [
  body('current_password').notEmpty().withMessage('Mot de passe actuel requis'),
  body('new_password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
    .withMessage('Nouveau mot de passe : 8 caractères min, 1 majuscule, 1 chiffre, 1 caractère spécial'),
], ctrl.changePassword);

module.exports = router;
