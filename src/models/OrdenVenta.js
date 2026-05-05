const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenVenta = sequelize.define('OrdenVenta', {
  NroOrdenVta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaEmision: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Motivo: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  Situacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDIENTE',
    validate: {
      isIn: [['PENDIENTE', 'COMPLETADO', 'ANULADO']],
    },
  },
}, {
  tableName: 'orden_venta',
  timestamps: false,
});

module.exports = OrdenVenta;