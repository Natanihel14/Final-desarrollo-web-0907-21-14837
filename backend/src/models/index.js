// Modelos (tablas) del sistema y sus relaciones.
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Usuario: puede ser 'usuario' (registra incidencias) o 'tecnico' (las atiende).
const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM('usuario', 'tecnico'),
    allowNull: false,
    defaultValue: 'usuario',
  },
});

// Equipo del laboratorio (computadora, proyector, etc.).
const Equipo = sequelize.define('Equipo', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  ubicacion: { type: DataTypes.STRING },
});

// Incidencia técnica reportada sobre un equipo.
const Incidencia = sequelize.define('Incidencia', {
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  estado: {
    type: DataTypes.ENUM('abierta', 'cerrada'),
    allowNull: false,
    defaultValue: 'abierta',
  },
  fechaCierre: { type: DataTypes.DATE },
});

// Relaciones:
// - Una incidencia pertenece a un equipo.
// - Una incidencia la crea un usuario (creador) y opcionalmente la cierra otro (cerradoPor).
Equipo.hasMany(Incidencia, { foreignKey: 'equipoId' });
Incidencia.belongsTo(Equipo, { foreignKey: 'equipoId' });

Usuario.hasMany(Incidencia, { foreignKey: 'usuarioId', as: 'incidencias' });
Incidencia.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'creador' });
Incidencia.belongsTo(Usuario, { foreignKey: 'cerradoPorId', as: 'cerradoPor' });

module.exports = { sequelize, Usuario, Equipo, Incidencia };
