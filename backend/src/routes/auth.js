const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

const router = express.Router();

// POST /api/auth/login -> valida credenciales y guarda el usuario en la sesión.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const usuario = await Usuario.findOne({ where: { username } });
  if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Solo se guardan en sesión los datos necesarios (nunca el hash).
  // El rol queda del lado del servidor, así el cliente no puede falsificarlo.
  req.session.usuario = {
    id: usuario.id,
    nombre: usuario.nombre,
    username: usuario.username,
    rol: usuario.rol,
  };
  res.json(req.session.usuario);
});

// GET /api/auth/me -> devuelve el usuario de la sesión actual (o 401).
router.get('/me', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Sin sesión' });
  }
  res.json(req.session.usuario);
});

// POST /api/auth/logout -> destruye la sesión y borra la cookie.
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.json({ ok: true });
  });
});

module.exports = router;
