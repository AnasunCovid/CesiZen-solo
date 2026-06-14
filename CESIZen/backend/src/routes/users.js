const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.use(auth, isAdmin);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

router.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*[0-9])/),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('role').optional().isIn(['user', 'admin']),
], ctrl.create);

router.put('/:id', [
  body('role').optional().isIn(['user', 'admin']),
  body('is_active').optional().isBoolean(),
], ctrl.update);

router.patch('/:id/deactivate', ctrl.deactivate);
router.delete('/:id', ctrl.remove);

module.exports = router;
