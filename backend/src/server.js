const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Sesión basada en cookie. La cookie 'sid' solo guarda el id de la sesión;
// los datos (id, nombre, rol) quedan en el servidor.
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'cambiar-este-secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // JavaScript del navegador no puede leerla
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipos', require('./routes/equipos'));
app.use('/api/incidencias', require('./routes/incidencias'));

// Manejo genérico de errores no controlados.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function iniciar() {
  await sequelize.sync(); // crea las tablas si no existen
  await seed();
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
}

iniciar();
