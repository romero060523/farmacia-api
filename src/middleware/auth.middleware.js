const jwt = require('jsonwebtoken');

// Verifica que el token JWT sea válido
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Formato esperado: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido. Usa: Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // disponible en todos los controladores
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Verifica que el usuario tenga uno de los roles permitidos
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };