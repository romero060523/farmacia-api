const { TipoMedic, Medicamento } = require('../models');

// GET /api/tipo-medic
const getAll = async (req, res) => {
  try {
    const tipos = await TipoMedic.findAll({
      order: [['descripcion', 'ASC']],
    });

    return res.status(200).json(tipos);
  } catch (error) {
    console.error('Error en getAll tipoMedic:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/tipo-medic/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const tipo = await TipoMedic.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }

    return res.status(200).json(tipo);
  } catch (error) {
    console.error('Error en getById tipoMedic:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/tipo-medic
const create = async (req, res) => {
  try {
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({ message: 'descripcion es obligatorio' });
    }

    const existe = await TipoMedic.findOne({ where: { descripcion } });
    if (existe) {
      return res.status(409).json({ message: 'Ya existe un tipo de medicamento con ese nombre' });
    }

    const tipo = await TipoMedic.create({ descripcion });

    return res.status(201).json({
      message: 'Tipo de medicamento creado correctamente',
      tipo,
    });
  } catch (error) {
    console.error('Error en create tipoMedic:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/tipo-medic/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;

    const tipo = await TipoMedic.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }

    await tipo.update({
      descripcion: descripcion ?? tipo.descripcion,
    });

    return res.status(200).json({
      message: 'Tipo de medicamento actualizado correctamente',
      tipo,
    });
  } catch (error) {
    console.error('Error en update tipoMedic:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/tipo-medic/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const tipo = await TipoMedic.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }

    // Verificar si tiene medicamentos asociados
    const tieneMedicamentos = await Medicamento.findOne({ where: { CodTipoMed: id } });
    if (tieneMedicamentos) {
      return res.status(409).json({
        message: 'No se puede eliminar el tipo porque tiene medicamentos asociados',
      });
    }

    await tipo.destroy();

    return res.status(200).json({ message: 'Tipo de medicamento eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove tipoMedic:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };