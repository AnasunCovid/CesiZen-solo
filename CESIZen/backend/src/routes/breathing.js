const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/breathingController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return next();
  const jwt = require('jsonwebtoken');
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch { /* anonymous */ }
  next();
};

router.get('/',    optionalAuth, ctrl.list);
router.get('/:id', ctrl.getOne);

router.post('/', auth, isAdmin, [
  body('name').trim().notEmpty().withMessage('Nom requis'),
  body('label').trim().notEmpty().withMessage('Label requis'),
  body('inhale_duration').isInt({ min: 1, max: 60 }).withMessage('Inspiration : 1-60 secondes'),
  body('hold_duration').optional().isInt({ min: 0, max: 60 }),
  body('exhale_duration').isInt({ min: 1, max: 60 }).withMessage('Expiration : 1-60 secondes'),
], ctrl.create);

router.put('/:id', auth, isAdmin, [
  body('inhale_duration').optional().isInt({ min: 1, max: 60 }),
  body('hold_duration').optional().isInt({ min: 0, max: 60 }),
  body('exhale_duration').optional().isInt({ min: 1, max: 60 }),
  body('is_active').optional().isBoolean(),
], ctrl.update);

router.delete('/:id', auth, isAdmin, ctrl.remove);

module.exports = router;
