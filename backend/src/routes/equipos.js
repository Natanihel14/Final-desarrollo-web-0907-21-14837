const express = require('express');
const { Equipo } = require('../models');
const { requiereSesion } = require('../middleware/auth');

const router = express.Router();

// GET /api/equipos -> listado de equipos del laboratorio.
router.get('/', requiereSesion, async (req, res) => {
  const equipos = await Equipo.findAll({ order: [['codigo', 'ASC']] });
  res.json(equipos);
});

module.exports = router;
