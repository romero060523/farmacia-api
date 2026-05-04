const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son obligatorios' });
    }

    // Verificar usuario duplicado
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'VENDEDOR',
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en register:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar password
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { register, login };