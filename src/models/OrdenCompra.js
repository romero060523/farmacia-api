const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenCompra = sequelize.define('OrdenCompra', {
  NroOrdenC: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaEmision: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Situacion: {
    type: DataTypes.ENUM('PENDIENTE', 'RECIBIDO', 'ANULADO'),
    allowNull: false,
    defaultValue: 'PENDIENTE',
  },
  Total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  CodLab: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'laboratorio', key: 'CodLab' },
  },
  NrofacturaProv: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'orden_compra',
  timestamps: false,
});

module.exports = OrdenCompra;