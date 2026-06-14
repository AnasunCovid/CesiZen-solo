const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/pageController');
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

router.get('/',          optionalAuth, ctrl.list);
router.get('/slug/:slug', optionalAuth, ctrl.getBySlug);
router.get('/:id',        auth, isAdmin, ctrl.getById);

router.post('/', auth, isAdmin, [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('Slug invalide (a-z, 0-9, tirets)'),
  body('content').optional(),
], ctrl.create);

router.put('/:id', auth, isAdmin, [
  body('title').optional().trim().notEmpty(),
  body('slug').optional().trim().matches(/^[a-z0-9-]+$/),
], ctrl.update);

router.delete('/:id', auth, isAdmin, ctrl.remove);

module.exports = router;
