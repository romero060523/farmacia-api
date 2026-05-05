const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
const medicamentoRoutes = require('./routes/medicamento.routes');
const compraRoutes = require('./routes/compra.routes');
const ventaRoutes = require('./routes/venta.routes');
const laboratorioRoutes = require('./routes/laboratorio.routes');
const especialidadRoutes = require('./routes/especialidad.routes');
const tipoMedicRoutes = require('./routes/tipoMedic.routes');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/compras', require('./routes/compra.routes'));
app.use('/api/ventas', require('./routes/venta.routes'));
app.use('/api/laboratorios',  laboratorioRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/tipo-medic',    tipoMedicRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Farmacia API corriendo' });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ruta ${req.method} ${req.url} no encontrada"})
})

// Sync DB y arrancar servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a PostgreSQL establecida');
    return sequelize.sync({ alter: true }); // alter:true actualiza tablas sin borrar datos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err.message);
  });

module.exports = app;