const express = require('express');
const { Incidencia, Equipo, Usuario } = require('../models');
const { requiereSesion } = require('../middleware/auth');

const router = express.Router();

// Datos a incluir al devolver una incidencia (sin exponer el hash de contraseña).
const incluir = [
  { model: Equipo, attributes: ['id', 'codigo', 'nombre'] },
  { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'rol'] },
  { model: Usuario, as: 'cerradoPor', attributes: ['id', 'nombre', 'rol'] },
];

// GET /api/incidencias -> lista de incidencias.
router.get('/', requiereSesion, async (req, res) => {
  const incidencias = await Incidencia.findAll({
    include: incluir,
    order: [['createdAt', 'DESC']],
  });
  res.json(incidencias);
});

// POST /api/incidencias -> registra una incidencia nueva.
router.post('/', requiereSesion, async (req, res) => {
  const { equipoId, descripcion } = req.body;
  if (!equipoId || !descripcion || !descripcion.trim()) {
    return res.status(400).json({ error: 'Equipo y descripción son obligatorios' });
  }

  const equipo = await Equipo.findByPk(equipoId);
  if (!equipo) {
    return res.status(404).json({ error: 'El equipo no existe' });
  }

  // El creador se toma de la sesión, NO del body: así nadie puede
  // registrar una incidencia a nombre de otro usuario.
  const nueva = await Incidencia.create({
    equipoId: equipo.id,
    descripcion: descripcion.trim(),
    usuarioId: req.session.usuario.id,
  });

  res.status(201).json(await Incidencia.findByPk(nueva.id, { include: incluir }));
});

// PATCH /api/incidencias/:id/cerrar -> cierra una incidencia.
// REGLA DE NEGOCIO: solo puede cerrarla quien la registró o un usuario con rol 'tecnico'.
// Se verifica aquí en el backend; ocultar el botón en el frontend no es suficiente.
router.patch('/:id/cerrar', requiereSesion, async (req, res) => {
  const incidencia = await Incidencia.findByPk(req.params.id);
  if (!incidencia) {
    return res.status(404).json({ error: 'Incidencia no encontrada' });
  }

  const { id, rol } = req.session.usuario;
  const esCreador = incidencia.usuarioId === id;
  const esTecnico = rol === 'tecnico';

  if (!esCreador && !esTecnico) {
    return res.status(403).json({
      error: 'Solo quien registró la incidencia o un técnico puede cerrarla',
    });
  }

  if (incidencia.estado === 'cerrada') {
    return res.status(409).json({ error: 'La incidencia ya está cerrada' });
  }

  incidencia.estado = 'cerrada';
  incidencia.fechaCierre = new Date();
  incidencia.cerradoPorId = id;
  await incidencia.save();

  res.json(await Incidencia.findByPk(incidencia.id, { include: incluir }));
});

module.exports = router;
