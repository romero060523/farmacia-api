const { Medicamento, Especialidad, TipoMedic } = require('../models');

// GET /api/medicamentos
const getAll = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      include: [
        { model: Especialidad, attributes: ['CodEspec', 'descripcionEsp'] },
        { model: TipoMedic,    attributes: ['CodTipoMed', 'descripcion'] },
      ],
    });

    return res.status(200).json(medicamentos);
  } catch (error) {
    console.error('Error en getAll medicamentos:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/medicamentos/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicamento = await Medicamento.findByPk(id, {
      include: [
        { model: Especialidad, attributes: ['CodEspec', 'descripcionEsp'] },
        { model: TipoMedic,    attributes: ['CodTipoMed', 'descripcion'] },
      ],
    });

    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }

    return res.status(200).json(medicamento);
  } catch (error) {
    console.error('Error en getById medicamento:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/medicamentos
const create = async (req, res) => {
  try {
    const {
      descripcionMed,
      fechaFabricacion,
      fechaVencimiento,
      Presentacion,
      stock,
      precioVentaUni,
      precioVentaPres,
      Marca,
      CodTipoMed,
      CodEspec,
    } = req.body;

    // Validar campos obligatorios
    if (!descripcionMed || !precioVentaUni || !CodTipoMed || !CodEspec) {
      return res.status(400).json({
        message: 'descripcionMed, precioVentaUni, CodTipoMed y CodEspec son obligatorios',
      });
    }

    // Validar que existan las FKs
    const tipoMedic = await TipoMedic.findByPk(CodTipoMed);
    if (!tipoMedic) {
      return res.status(404).json({ message: 'TipoMedic no encontrado' });
    }

    const especialidad = await Especialidad.findByPk(CodEspec);
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    const medicamento = await Medicamento.create({
      descripcionMed,
      fechaFabricacion,
      fechaVencimiento,
      Presentacion,
      stock: stock || 0,
      precioVentaUni,
      precioVentaPres,
      Marca,
      CodTipoMed,
      CodEspec,
    });

    return res.status(201).json({
      message: 'Medicamento creado correctamente',
      medicamento,
    });
  } catch (error) {
    console.error('Error en create medicamento:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/medicamentos/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      descripcionMed,
      fechaFabricacion,
      fechaVencimiento,
      Presentacion,
      stock,
      precioVentaUni,
      precioVentaPres,
      Marca,
      CodTipoMed,
      CodEspec,
    } = req.body;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }

    // Validar FKs solo si se están actualizando
    if (CodTipoMed) {
      const tipoMedic = await TipoMedic.findByPk(CodTipoMed);
      if (!tipoMedic) {
        return res.status(404).json({ message: 'TipoMedic no encontrado' });
      }
    }

    if (CodEspec) {
      const especialidad = await Especialidad.findByPk(CodEspec);
      if (!especialidad) {
        return res.status(404).json({ message: 'Especialidad no encontrada' });
      }
    }

    await medicamento.update({
      descripcionMed:  descripcionMed  ?? medicamento.descripcionMed,
      fechaFabricacion: fechaFabricacion ?? medicamento.fechaFabricacion,
      fechaVencimiento: fechaVencimiento ?? medicamento.fechaVencimiento,
      Presentacion:    Presentacion    ?? medicamento.Presentacion,
      stock:           stock           ?? medicamento.stock,
      precioVentaUni:  precioVentaUni  ?? medicamento.precioVentaUni,
      precioVentaPres: precioVentaPres ?? medicamento.precioVentaPres,
      Marca:           Marca           ?? medicamento.Marca,
      CodTipoMed:      CodTipoMed      ?? medicamento.CodTipoMed,
      CodEspec:        CodEspec        ?? medicamento.CodEspec,
    });

    return res.status(200).json({
      message: 'Medicamento actualizado correctamente',
      medicamento,
    });
  } catch (error) {
    console.error('Error en update medicamento:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/medicamentos/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }

    await medicamento.destroy();

    return res.status(200).json({ message: 'Medicamento eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove medicamento:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };