const {
  sequelize,
  OrdenVenta,
  DetalleOrdenVenta,
  Medicamento,
} = require('../models');

// GET /api/ventas
const getAll = async (req, res) => {
  try {
    const ventas = await OrdenVenta.findAll({
      include: [
        {
          model: DetalleOrdenVenta,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'stock', 'precioVentaUni'],
            },
          ],
        },
      ],
      order: [['NroOrdenVta', 'DESC']],
    });

    return res.status(200).json(ventas);
  } catch (error) {
    console.error('Error en getAll ventas:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/ventas/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await OrdenVenta.findByPk(id, {
      include: [
        {
          model: DetalleOrdenVenta,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'stock', 'precioVentaUni'],
            },
          ],
        },
      ],
    });

    if (!venta) {
      return res.status(404).json({ message: 'Orden de venta no encontrada' });
    }

    return res.status(200).json(venta);
  } catch (error) {
    console.error('Error en getById venta:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/ventas
const create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { Motivo, fechaEmision, detalle } = req.body;

    // ── Validaciones de entrada ──────────────────────────────
    if (!detalle || !Array.isArray(detalle) || detalle.length === 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'detalle (array) es obligatorio y no puede estar vacío',
      });
    }

    for (const item of detalle) {
      if (!item.CodMedicamento || !item.cantidadRequerida) {
        await t.rollback();
        return res.status(400).json({
          message: 'Cada detalle requiere: CodMedicamento y cantidadRequerida',
        });
      }

      if (item.cantidadRequerida <= 0) {
        await t.rollback();
        return res.status(400).json({
          message: 'cantidadRequerida debe ser mayor a 0',
        });
      }
    }

    // ── Validar stock de cada medicamento ────────────────────
    // lock: true → SELECT FOR UPDATE, bloquea el registro en la transacción
    const detalleEnriquecido = [];

    for (const item of detalle) {
      const medicamento = await Medicamento.findByPk(item.CodMedicamento, {
        transaction: t,
        lock: t.LOCK.UPDATE, // evita condición de carrera
      });

      if (!medicamento) {
        await t.rollback();
        return res.status(404).json({
          message: `Medicamento con ID ${item.CodMedicamento} no encontrado`,
        });
      }

      // ⚠️ Validación crítica de stock
      if (medicamento.stock < item.cantidadRequerida) {
        await t.rollback();
        return res.status(400).json({
          message: `Stock insuficiente para "${medicamento.descripcionMed}". Stock disponible: ${medicamento.stock}, requerido: ${item.cantidadRequerida}`,
        });
      }

      detalleEnriquecido.push({
        medicamento,
        CodMedicamento:    item.CodMedicamento,
        descripcionMed:    item.descripcionMed || medicamento.descripcionMed,
        cantidadRequerida: item.cantidadRequerida,
      });
    }

    // ── 1. Crear OrdenVenta ──────────────────────────────────
    const ordenVenta = await OrdenVenta.create({
      fechaEmision: fechaEmision || new Date(),
      Motivo:       Motivo || null,
      Situacion:    'COMPLETADO',
    }, { transaction: t });

    // ── 2. Crear detalles + 3. Decrementar stock ─────────────
    for (const item of detalleEnriquecido) {
      // Crear detalle de venta
      await DetalleOrdenVenta.create({
        NroOrdenVta:       ordenVenta.NroOrdenVta,
        CodMedicamento:    item.CodMedicamento,
        descripcionMed:    item.descripcionMed,
        cantidadRequerida: item.cantidadRequerida,
      }, { transaction: t });

      // Decrementar stock
      await item.medicamento.decrement('stock', {
        by: item.cantidadRequerida,
        transaction: t,
      });
    }

    // ── Confirmar transacción ────────────────────────────────
    await t.commit();

    // Retornar venta completa
    const ventaCompleta = await OrdenVenta.findByPk(ordenVenta.NroOrdenVta, {
      include: [
        {
          model: DetalleOrdenVenta,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'stock'],
            },
          ],
        },
      ],
    });

    return res.status(201).json({
      message: 'Orden de venta registrada y stock actualizado correctamente',
      orden: ventaCompleta,
    });

  } catch (error) {
    await t.rollback();
    console.error('Error en create venta:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create };