const { Router } = require('express');
const { getAll, getById, create } = require('../controllers/compra.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = Router();

router.get('/',    verifyToken, checkRole('ADMIN', 'ALMACEN'), getAll);
router.get('/:id', verifyToken, checkRole('ADMIN', 'ALMACEN'), getById);
router.post('/',   verifyToken, checkRole('ADMIN', 'ALMACEN'), create);

module.exports = router;