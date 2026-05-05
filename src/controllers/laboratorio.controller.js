const { Laboratorio, OrdenCompra } = require('../models');

// GET /api/laboratorios
const getAll = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.findAll({
      order: [['razonSocial', 'ASC']],
    });

    return res.status(200).json(laboratorios);
  } catch (error) {
    console.error('Error en getAll laboratorios:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/laboratorios/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const laboratorio = await Laboratorio.findByPk(id);
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }

    return res.status(200).json(laboratorio);
  } catch (error) {
    console.error('Error en getById laboratorio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/laboratorios
const create = async (req, res) => {
  try {
    const { razonSocial, direccion, telefono, email, contacto } = req.body;

    if (!razonSocial) {
      return res.status(400).json({ message: 'razonSocial es obligatorio' });
    }

    // Verificar duplicado por razonSocial
    const existe = await Laboratorio.findOne({ where: { razonSocial } });
    if (existe) {
      return res.status(409).json({ message: 'Ya existe un laboratorio con esa razón social' });
    }

    const laboratorio = await Laboratorio.create({
      razonSocial,
      direccion: direccion || null,
      telefono:  telefono  || null,
      email:     email     || null,
      contacto:  contacto  || null,
    });

    return res.status(201).json({
      message: 'Laboratorio creado correctamente',
      laboratorio,
    });
  } catch (error) {
    console.error('Error en create laboratorio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/laboratorios/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { razonSocial, direccion, telefono, email, contacto } = req.body;

    const laboratorio = await Laboratorio.findByPk(id);
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }

    await laboratorio.update({
      razonSocial: razonSocial ?? laboratorio.razonSocial,
      direccion:   direccion   ?? laboratorio.direccion,
      telefono:    telefono    ?? laboratorio.telefono,
      email:       email       ?? laboratorio.email,
      contacto:    contacto    ?? laboratorio.contacto,
    });

    return res.status(200).json({
      message: 'Laboratorio actualizado correctamente',
      laboratorio,
    });
  } catch (error) {
    console.error('Error en update laboratorio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/laboratorios/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const laboratorio = await Laboratorio.findByPk(id);
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }

    // Verificar si tiene órdenes de compra asociadas
    const tieneCompras = await OrdenCompra.findOne({ where: { CodLab: id } });
    if (tieneCompras) {
      return res.status(409).json({
        message: 'No se puede eliminar el laboratorio porque tiene órdenes de compra asociadas',
      });
    }

    await laboratorio.destroy();

    return res.status(200).json({ message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove laboratorio:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };