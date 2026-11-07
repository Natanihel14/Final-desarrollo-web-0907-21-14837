// Middleware que exige una sesión activa.
// La sesión vive en el servidor; el navegador solo guarda la cookie con el id de sesión.
function requiereSesion(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Debe iniciar sesión' });
  }
  next();
}

module.exports = { requiereSesion };
