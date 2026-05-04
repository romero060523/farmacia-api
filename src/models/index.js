const sequelize = require('../config/database');

const Especialidad        = require('./Especialidad');
const TipoMedic           = require('./TipoMedic');
const Laboratorio         = require('./Laboratorio');
const Usuario             = require('./Usuario');
const Medicamento         = require('./Medicamento');
const OrdenCompra         = require('./OrdenCompra');
const DetalleOrdenCompra  = require('./DetalleOrdenCompra');
const OrdenVenta          = require('./OrdenVenta');
const DetalleOrdenVenta     = require('./DetalleOrdenVenta');

// Medicamento ↔ Especialidad / TipoMedic
Medicamento.belongsTo(Especialidad,  { foreignKey: 'CodEspec' });
Medicamento.belongsTo(TipoMedic,     { foreignKey: 'CodTipoMed' });

// OrdenCompra ↔ Laboratorio
OrdenCompra.belongsTo(Laboratorio,   { foreignKey: 'CodLab' });

// OrdenCompra ↔ DetalleOrdenCompra
OrdenCompra.hasMany(DetalleOrdenCompra,   { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

// OrdenVenta ↔ DetalleOrdenVenta
OrdenVenta.hasMany(DetalleOrdenVenta,   { foreignKey: 'NroOrdenVta' });
DetalleOrdenVenta.belongsTo(OrdenVenta, { foreignKey: 'NroOrdenVta' });
DetalleOrdenVenta.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

module.exports = {
  sequelize,
  Especialidad,
  TipoMedic,
  Laboratorio,
  Usuario,
  Medicamento,
  OrdenCompra,
  DetalleOrdenCompra,
  OrdenVenta,
  DetalleOrdenVenta,
};