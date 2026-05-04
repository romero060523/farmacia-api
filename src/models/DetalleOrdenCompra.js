const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NroOrdenC: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orden_compra', key: 'NroOrdenC' },
  },
  CodMedicamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'medicamento', key: 'CodMedicamento' },
  },
  descripcion: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  montouni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'detalle_orden_compra',
  timestamps: false,
});

module.exports = DetalleOrdenCompra;