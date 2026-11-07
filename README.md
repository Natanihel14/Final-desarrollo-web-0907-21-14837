# Registro de incidencias técnicas de laboratorio

Backend: Node.js + Express + Sequelize (SQLite) + sesión por cookie (`express-session`).
Frontend: React (Vite).

## Cómo ejecutar

Terminal 1 (API en http://localhost:3001):

```bash
cd backend
npm install
npm start
```

Terminal 2 (interfaz en http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

La primera vez se crea `backend/database.sqlite` con datos de prueba.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| ana | ana123 | usuario |
| carlos | carlos123 | usuario |
| tecnico | tecnico123 | tecnico |

## Regla de negocio

Una incidencia solo puede cerrarla quien la registró o un usuario con rol `tecnico`.
Se verifica en el backend en `PATCH /api/incidencias/:id/cerrar`
(`backend/src/routes/incidencias.js`); si no se cumple responde `403`.

Ver también [decisiones.md](decisiones.md) y [prompts.md](prompts.md).
