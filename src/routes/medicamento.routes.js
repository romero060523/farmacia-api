const { Router } = require('express');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/medicamento.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = Router();

// Todos los roles autenticados pueden listar
router.get('/',    verifyToken, getAll);
router.get('/:id', verifyToken, getById);

// ADMIN y ALMACEN pueden crear y actualizar
router.post('/',    verifyToken, checkRole('ADMIN', 'ALMACEN'), create);
router.put('/:id',  verifyToken, checkRole('ADMIN', 'ALMACEN'), update);

// Solo ADMIN puede eliminar
router.delete('/:id', verifyToken, checkRole('ADMIN'), remove);

module.exports = router;