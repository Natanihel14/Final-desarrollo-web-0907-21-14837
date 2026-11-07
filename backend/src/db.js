// Conexión a la base de datos con Sequelize.
// Se usa SQLite porque no requiere instalar un servidor: la BD es un archivo.
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;
