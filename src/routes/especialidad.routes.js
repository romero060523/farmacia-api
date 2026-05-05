const { Router } = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/especialidad.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = Router();

router.get('/',    verifyToken, getAll);
router.get('/:id', verifyToken, getById);
router.post('/',   verifyToken, checkRole('ADMIN'), create);
router.put('/:id', verifyToken, checkRole('ADMIN'), update);
router.delete('/:id', verifyToken, checkRole('ADMIN'), remove);

module.exports = router;