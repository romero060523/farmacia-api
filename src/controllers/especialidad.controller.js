const { Especialidad, Medicamento } = require('../models');

// GET /api/especialidades
const getAll = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      order: [['descripcionEsp', 'ASC']],
    });

    return res.status(200).json(especialidades);
  } catch (error) {
    console.error('Error en getAll especialidades:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/especialidades/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    return res.status(200).json(especialidad);
  } catch (error) {
    console.error('Error en getById especialidad:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/especialidades
const create = async (req, res) => {
  try {
    const { descripcionEsp } = req.body;

    if (!descripcionEsp) {
      return res.status(400).json({ message: 'descripcionEsp es obligatorio' });
    }

    const existe = await Especialidad.findOne({ where: { descripcionEsp } });
    if (existe) {
      return res.status(409).json({ message: 'Ya existe una especialidad con ese nombre' });
    }

    const especialidad = await Especialidad.create({ descripcionEsp });

    return res.status(201).json({
      message: 'Especialidad creada correctamente',
      especialidad,
    });
  } catch (error) {
    console.error('Error en create especialidad:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/especialidades/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcionEsp } = req.body;

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    await especialidad.update({
      descripcionEsp: descripcionEsp ?? especialidad.descripcionEsp,
    });

    return res.status(200).json({
      message: 'Especialidad actualizada correctamente',
      especialidad,
    });
  } catch (error) {
    console.error('Error en update especialidad:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/especialidades/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    // Verificar si tiene medicamentos asociados
    const tieneMedicamentos = await Medicamento.findOne({ where: { CodEspec: id } });
    if (tieneMedicamentos) {
      return res.status(409).json({
        message: 'No se puede eliminar la especialidad porque tiene medicamentos asociados',
      });
    }

    await especialidad.destroy();

    return res.status(200).json({ message: 'Especialidad eliminada correctamente' });
  } catch (error) {
    console.error('Error en remove especialidad:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };