// Datos iniciales: usuarios de prueba (uno por rol) y algunos equipos.
// Se ejecuta solo si la tabla de usuarios está vacía.
const bcrypt = require('bcryptjs');
const { Usuario, Equipo } = require('./models');

async function seed() {
  if ((await Usuario.count()) > 0) return;

  const hash = (p) => bcrypt.hashSync(p, 10);

  await Usuario.bulkCreate([
    { nombre: 'Ana López', username: 'ana', passwordHash: hash('ana123'), rol: 'usuario' },
    { nombre: 'Carlos Pérez', username: 'carlos', passwordHash: hash('carlos123'), rol: 'usuario' },
    { nombre: 'Técnico Soporte', username: 'tecnico', passwordHash: hash('tecnico123'), rol: 'tecnico' },
  ]);

  await Equipo.bulkCreate([
    { codigo: 'PC-01', nombre: 'Computadora de escritorio Dell', ubicacion: 'Laboratorio A' },
    { codigo: 'PC-02', nombre: 'Computadora de escritorio HP', ubicacion: 'Laboratorio A' },
    { codigo: 'PRY-01', nombre: 'Proyector Epson', ubicacion: 'Laboratorio A' },
    { codigo: 'IMP-01', nombre: 'Impresora Canon', ubicacion: 'Laboratorio B' },
    { codigo: 'RTR-01', nombre: 'Router Cisco', ubicacion: 'Laboratorio B' },
  ]);

  console.log('Datos iniciales creados');
}

module.exports = seed;
