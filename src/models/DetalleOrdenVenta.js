const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenVenta = sequelize.define('DetalleOrdenVenta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NroOrdenVta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orden_venta', key: 'NroOrdenVta' },
  },
  CodMedicamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'medicamento', key: 'CodMedicamento' },
  },
  descripcionMed: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  cantidadRequerida: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'detalle_orden_vta',
  timestamps: false,
});

module.exports = DetalleOrdenVenta;