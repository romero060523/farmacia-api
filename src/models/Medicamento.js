const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcionMed: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  fechaFabricacion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fechaVencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  Presentacion: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  precioVentaUni: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  precioVentaPres: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  CodTipoMed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tipo_medic', key: 'CodTipoMed' },
  },
  CodEspec: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'especialidad', key: 'CodEspec' },
  },
}, {
  tableName: 'medicamento',
  timestamps: false,
});

module.exports = Medicamento;