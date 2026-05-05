const { Router } = require('express');
const { getAll, getById, create } = require('../controllers/venta.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = Router();

router.get('/',    verifyToken, checkRole('ADMIN', 'VENDEDOR'), getAll);
router.get('/:id', verifyToken, checkRole('ADMIN', 'VENDEDOR'), getById);
router.post('/',   verifyToken, checkRole('ADMIN', 'VENDEDOR'), create);

module.exports = router;