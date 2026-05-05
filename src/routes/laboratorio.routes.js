const { Router } = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/laboratorio.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = Router();

router.get('/',    verifyToken, checkRole('ADMIN', 'ALMACEN'), getAll);
router.get('/:id', verifyToken, checkRole('ADMIN', 'ALMACEN'), getById);
router.post('/',   verifyToken, checkRole('ADMIN'), create);
router.put('/:id', verifyToken, checkRole('ADMIN'), update);
router.delete('/:id', verifyToken, checkRole('ADMIN'), remove);

module.exports = router;