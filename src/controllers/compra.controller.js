const { sequelize, OrdenCompra, DetalleOrdenCompra, Medicamento, Laboratorio } = require('../models');

// GET /api/compras
const getAll = async (req, res) => {
  try {
    const compras = await OrdenCompra.findAll({
      include: [
        {
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial', 'telefono'],
        },
        {
          model: DetalleOrdenCompra,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'stock'],
            },
          ],
        },
      ],
      order: [['NroOrdenC', 'DESC']],
    });

    return res.status(200).json(compras);
  } catch (error) {
    console.error('Error en getAll compras:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/compras/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await OrdenCompra.findByPk(id, {
      include: [
        {
          model: Laboratorio,
          attributes: ['CodLab', 'razonSocial', 'telefono', 'email'],
        },
        {
          model: DetalleOrdenCompra,
          include: [
            {
              model: Medicamento,
              attributes: ['CodMedicamento', 'descripcionMed', 'stock', 'precioVentaUni'],
            },
          ],
        },
      ],
    });

    if (!compra) {
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }

    return res.status(200).json(compra);
  } catch (error) {
    console.error('Error en getById compra:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/compras
const create = async (req, res) => {
  // Iniciar transacción
  const t = await sequelize.transaction();

  try {
    const { CodLab, NrofacturaProv, fechaEmision, detalle } = req.body;

    // ── Validaciones de entrada ──────────────────────────────
    if (!CodLab || !detalle || !Array.isArray(detalle) || detalle.length === 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'CodLab y detalle (array) son obligatorios',
      });
    }

    // Validar que el laboratorio exista
    const laboratorio = await Laboratorio.findByPk(CodLab, { transaction: t });
    if (!laboratorio) {
      await t.rollback();
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }

    // Validar estructura de cada item del detalle
    for (const item of detalle) {
      if (!item.CodMedicamento || !item.cantidad || !item.precio) {
        await t.rollback();
        return res.status(400).json({
          message: 'Cada detalle requiere: CodMedicamento, cantidad y precio',
        });
      }

      if (item.cantidad <= 0 || item.precio <= 0) {
        await t.rollback();
        return res.status(400).json({
          message: 'Cantidad y precio deben ser mayores a 0',
        });
      }
    }

    // ── Calcular total de la orden ───────────────────────────
    let totalOrden = 0;
    const detalleEnriquecido = [];

    for (const item of detalle) {
      const medicamento = await Medicamento.findByPk(item.CodMedicamento, { transaction: t });

      if (!medicamento) {
        await t.rollback();
        return res.status(404).json({
          message: `Medicamento con ID ${item.CodMedicamento} no encontrado`,
        });
      }

      const montouni = item.cantidad * item.precio;
      totalOrden += montouni;

      detalleEnriquecido.push({
        medicamento,
        CodMedicamento: item.CodMedicamento,
        descripcion:    item.descripcion || medicamento.descripcionMed,
        cantidad:       item.cantidad,
        precio:         item.precio,
        montouni,
      });
    }

    // ── 1. Crear OrdenCompra ─────────────────────────────────
    const ordenCompra = await OrdenCompra.create({
      fechaEmision: fechaEmision || new Date(),
      Situacion:    'RECIBIDO',
      Total:        totalOrden,
      CodLab,
      NrofacturaProv: NrofacturaProv || null,
    }, { transaction: t });

    // ── 2. Crear detalles + 3. Actualizar stock ──────────────
    for (const item of detalleEnriquecido) {
      // Crear detalle
      await DetalleOrdenCompra.create({
        NroOrdenC:      ordenCompra.NroOrdenC,
        CodMedicamento: item.CodMedicamento,
        descripcion:    item.descripcion,
        cantidad:       item.cantidad,
        precio:         item.precio,
        montouni:       item.montouni,
      }, { transaction: t });

      // Incrementar stock del medicamento
      await item.medicamento.increment('stock', {
        by: item.cantidad,
        transaction: t,
      });
    }

    // ── Confirmar transacción ────────────────────────────────
    await t.commit();

    // Retornar orden completa
    const ordenCompleta = await OrdenCompra.findByPk(ordenCompra.NroOrdenC, {
      include: [
        { model: Laboratorio, attributes: ['CodLab', 'razonSocial'] },
        {
          model: DetalleOrdenCompra,
          include: [{ model: Medicamento, attributes: ['CodMedicamento', 'descripcionMed', 'stock'] }],
        },
      ],
    });

    return res.status(201).json({
      message: 'Orden de compra registrada y stock actualizado correctamente',
      orden: ordenCompleta,
    });

  } catch (error) {
    await t.rollback();
    console.error('Error en create compra:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create };