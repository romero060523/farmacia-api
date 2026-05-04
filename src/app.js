const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Farmacia API corriendo ✅' });
});

// Sync DB y arrancar servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida');
    return sequelize.sync({ alter: true }); // alter:true actualiza tablas sin borrar datos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  });

module.exports = app;