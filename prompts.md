# Registro de Prompts del Examen Final

**Asignatura:** Desarrollo Web  
**Estudiante:** Natanihel (Carne: 0907-21-14837)  
**Herramienta Asistente:** Asistente de IA (Consultas tecnicas y apoyo en codigo)

Durante el desarrollo del proyecto utilice la IA como un copiloto de consulta tecnica para resolver dudas especificas de sintaxis, configuracion de librerias y generacion de datos de prueba, manteniendo en todo momento el control del diseno y la logica de la aplicacion.

---

### Prompt 1: Modelado de relaciones en Sequelize
> *"Estoy modelando la base de datos en Sequelize con SQLite para un sistema de incidencias. Ya tengo los modelos Usuario y Equipo. En el modelo Incidencia necesito que apunte a Usuario dos veces: una para el usuario que la reporto (usuarioId) y otra para el tecnico o usuario que la cerro (cerradoPorId). ¿Como defino correctamente esas dos asociaciones belongsTo con sus alias en Sequelize para que no choquen?"*

* **Aporte propio / Resultado:**  
  La IA me proporciono la sintaxis con los alias `as: 'creador'` y `as: 'cerradoPor'`. Con esto pude estructurar mis modelos en `models/index.js` y hacer que al consultar las incidencias se incluyera el nombre del autor y de quien resolvio la falla sin exponer el hash de la contrasena.

---

### Prompt 2: Manejo de cookies de sesion entre Vite y Express
> *"Tengo mi backend en Express corriendo en el puerto 3001 usando express-session con cookies httpOnly. Al hacer peticiones desde React (Vite en puerto 5173), las cookies no se guardan o tengo problemas de origenes cruzados. ¿Es mejor configurar CORS con credentials o usar un proxy en vite.config.js? ¿Como se configura el proxy para que las peticiones a /api vayan directo al backend compartiendo origen?"*

* **Aporte propio / Resultado:**  
  La IA me explico que la forma mas limpia en desarrollo local para no complicarse con cabeceras de CORS es el proxy de Vite (`server: { proxy: { '/api': 'http://localhost:3001' } }`). Lo aplique en `vite.config.js`, lo que permitio que el navegador maneje la cookie `sid` de forma totalmente transparente y segura.

---

### Prompt 3: Script de datos semilla (Seed) con bcrypt
> *"Ayudame con un script para poblar datos iniciales (seed.js) en SQLite. Necesito crear 4 equipos de laboratorio (computadoras, impresoras) y 3 usuarios de prueba: dos con rol usuario y uno con rol tecnico, con sus contrasenas encriptadas con bcryptjs usando un salt de 10 rondas para poder probar el login de inmediato."*

* **Aporte propio / Resultado:**  
  Le delegue a la IA la creacion repetitiva de los hashes y los `bulkCreate`. Revise que los usuarios tuvieran los roles exactos requeridos por el enunciado (`usuario1`, `usuario2` y `tecnico1`) para poder validar mas adelante la regla de negocio.

---

### Prompt 4: Consulta sobre la regla de negocio y validacion de seguridad
> *"Tengo el endpoint PATCH /api/incidencias/:id/cerrar. Quiero confirmar cual es la mejor forma de protegerlo: la regla es que solo el creador de la incidencia o un tecnico pueden cerrarla. En el frontend ya condicionalizo el boton, pero se que debo verificarlo en el backend. ¿Como valido contra req.session.usuario y que codigo HTTP de error es el estandar cuando no tienen permiso?"*

* **Aporte propio / Resultado:**  
  La IA me confirmo que el codigo estandar de rechazo de autorizacion es **HTTP 403 Forbidden** (a diferencia de 401 que es falta de autenticacion). Implemente la condicion en el controlador:
  ```javascript
  const esCreador = incidencia.usuarioId === req.session.usuario.id;
  const esTecnico = req.session.usuario.rol === 'tecnico';
  if (!esCreador && !esTecnico) {
    return res.status(403).json({ error: 'Solo quien registro la incidencia o un tecnico puede cerrarla' });
  }
  ```

---

### Prompt 5: Diseno visual de la tabla de incidencias en CSS
> *"Dame una estructura CSS moderna y limpia para una tabla de incidencias en React. Quiero que tenga tarjetas (cards), separacion clara entre filas, un badge rojo para el estado 'abierta' y un badge azul para 'cerrada', ademas de estilo sutil para cuando una fila ya este resuelta."*

* **Aporte propio / Resultado:**  
  Aproveche el codigo CSS sugerido para darle un aspecto visual ordenado a la interfaz sin perder tiempo en diseno estetico, enfocandome en que las acciones del usuario respondieran correctamente a la logica del backend.
