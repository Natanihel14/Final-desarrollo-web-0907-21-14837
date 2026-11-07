# Informe de Decisiones del Proyecto

**Asignatura:** Desarrollo Web  
**Examen:** Evaluacion Final - Serie II  
**Estudiante:** Natanihel (Carne: 0907-21-14837)  
**Stack de Desarrollo:** Node.js, Express, Sequelize (SQLite), React.js (Vite), Sesion por Cookies.

---

## (a) Que entendi del problema y que tablas/modelos planee

### 1. Entendimiento del problema y requerimientos
El examen solicita un sistema web para gestionar incidencias tecnicas en un laboratorio de computacion (reportar computadoras danadas, problemas de red, impresoras sin toner, etc.). Al analizar el enunciado, identifique tres aspectos criticos que dictaron mi diseno:

* **Manejo de Roles:** El sistema debe diferenciar entre dos tipos de usuarios:
  * `usuario`: Alumnos o docentes que usan el laboratorio y reportan desperfectos.
  * `tecnico`: Personal de soporte encargado de dar mantenimiento a las maquinas.
* **Seguridad y Sesiones mediante Cookies:** No debia usar tokens JWT en `localStorage` (vulnerables a ataques XSS), sino **cookies de sesion HTTP** gestionadas desde el servidor (`express-session` con `httpOnly: true`). De esta manera, el navegador unicamente conserva un identificador de sesion cifrado (`sid`) y los datos sensibles (como el rol y el ID real del usuario) se quedan resguardados en la memoria del backend, impidiendo que el cliente pueda alterar su propio rol en el navegador.
* **Regla de negocio no negociable (validada en Backend):**
  * *Una incidencia solo puede ser cerrada por el usuario que la registro o por un usuario con rol tecnico.*
  * Esta comprobacion debia residir forzosamente en el endpoint del backend (`PATCH /api/incidencias/:id/cerrar`). No basta con ocultar o deshabilitar el boton en la interfaz de React, ya que cualquier usuario con conocimientos basicos podria enviar una peticion HTTP directa mediante Postman o la consola del navegador.

### 2. Diseno de Modelos y Base de Datos (Sequelize + SQLite)
Elegi **SQLite** como motor relacional porque permite ejecutar el proyecto de forma 100% portable y autonoma en un unico archivo (`database.sqlite`), sin necesidad de que el evaluador instale ni configure servicios externos como PostgreSQL o MySQL.

Disene tres modelos relacionales con sus respectivas claves foraneas:

1. **`Usuario` (Tabla `Usuarios`):**
   * `id`: Identificador numerico primario (auto-incremental).
   * `nombre`: Nombre legible del usuario.
   * `username`: Identificador unico para el inicio de sesion.
   * `password`: Hash de la contrasena generado con `bcryptjs` (nunca se almacena texto plano).
   * `rol`: Campo tipo `ENUM('usuario', 'tecnico')`.
   * *Relacion:* Un usuario tiene muchas incidencias (`Usuario.hasMany(Incidencia, { as: 'incidencias', foreignKey: 'usuarioId' })`).

2. **`Equipo` (Tabla `Equipos`):**
   * `id`: Clave primaria.
   * `codigo`: Identificador fisico unico del equipo (ej. `PC-LAB1-01`, `IMP-3D-01`).
   * `nombre`: Nombre descriptivo del equipo.
   * `ubicacion`: Lugar fisico donde se encuentra en el laboratorio.
   * *Relacion:* Un equipo puede acumular multiples reportes a lo largo del tiempo (`Equipo.hasMany(Incidencia, { foreignKey: 'equipoId' })`).

3. **`Incidencia` (Tabla `Incidencias`):**
   * `id`: Clave primaria.
   * `descripcion`: Detalle de la averia.
   * `estado`: Estado del reporte (`ENUM('abierta', 'cerrada')`), por defecto `'abierta'`.
   * `fechaCierre`: Fecha y hora en la que se soluciono el problema (nulo mientras este abierta).
   * `usuarioId`: Clave foranea del usuario que creo el reporte.
   * `equipoId`: Clave foranea del equipo reportado.
   * `cerradoPorId`: Clave foranea hacia `Usuario`, que registra quien ejecuto el cierre (si fue el creador o un tecnico).

---

## (b) Que partes se delegaron a la IA y por que

Para este proyecto utilice la Inteligencia Artificial como una herramienta de apoyo y consulta tecnica puntual (*pair programming*), manteniendo en todo momento la autoria del diseno y la arquitectura:

### Que partes delegue o consulte a la IA:
1. **Configuracion de arranque y codigo repetitivo (*Boilerplate*):**
   * Consulte la configuracion del proxy en `vite.config.js` y la estructura inicial de Express.
   * *Por que:* Son configuraciones estandar que no aportan a la logica de negocio; automatizarlas ahorra tiempo de setup.
2. **Generacion de datos semilla (*seed*):**
   * Le pedi a la IA generar el script `seed.js` con las inserciones iniciales y el hasheo de contrasenas con bcrypt.
   * *Por que:* Crear datos de prueba a mano es una tarea puramente mecanica.
3. **Estilos de interfaz (CSS):**
   * Le solicite sugerencias de reglas CSS para las tarjetas y las tablas de incidencias.
   * *Por que:* Permite obtener una interfaz visualmente profesional y ordenada sin desviar tiempo de la logica del backend y la base de datos.

### Que desarrolle y controle personalmente:
* **Diseno del esquema de base de datos y asociaciones:** La estructura relacional de los tres modelos y la logica de doble relacion en Incidencias (`creador` y `cerradoPor`).
* **Logica de autorizacion y regla de negocio en el Backend:** Implemente y verifique la condicion en `PATCH /api/incidencias/:id/cerrar` asegurando que devuelva `403 Forbidden` si el usuario en sesion no tiene los permisos requeridos.
* **Flujo completo de autenticacion con cookies:** Comprobe el almacenamiento de la cookie de sesion en el navegador, la expiracion de la sesion y el correcto funcionamiento del cierre de sesion (`logout`).

---

## (c) Que hizo mal la IA o que se tuvo que corregir, y como me di cuenta

Durante el desarrollo identifique fallos y malas practicas en las respuestas de la IA que tuve que corregir activamente:

### 1. Clave secreta de sesion escrita directamente en el codigo (*Hardcoded Secret*)
* **El fallo:** En una de las primeras sugerencias para `backend/src/server.js`, la IA propuso un valor por defecto fijo:
  ```javascript
  secret: process.env.SESSION_SECRET || 'mi-clave-secreta-123',
  ```
* **Como me di cuenta:** Al revisar el codigo antes de confirmarlo. Como el repositorio es publico en GitHub, dejar un secreto fijo en el codigo es una vulnerabilidad grave porque cualquier tercero podria firmar cookies validas.
* **La correccion:** Modifique el codigo para que, si no se define `SESSION_SECRET`, se genere una clave criptografica aleatoria con `crypto.randomBytes(32).toString('hex')` en tiempo de ejecucion.

### 2. Intento de ejecutar un comando destructivo en la terminal
* **El fallo:** Al consultar como reiniciar el backend tras un cambio de configuracion, la IA sugirio ejecutar `taskkill /F /IM node.exe`.
* **Como me di cuenta:** Leyendo el comando con criterio antes de ingresarlo a la consola. Ese comando hubiera finalizado de golpe todos los procesos de Node.js activos en mi computadora, no unicamente el servidor de este examen.
* **La correccion:** Descarte la sugerencia y gestione la detencion del proceso de forma limpia usando `Ctrl + C` en la terminal correspondiente.

### 3. Recibir el creador de la incidencia desde el cuerpo de la peticion (*Request Body*)
* **El fallo:** La IA inicialmente sugirio recibir el `usuarioId` en el cuerpo del JSON (`req.body`) al crear una nueva incidencia.
* **Como me di cuenta:** Analizando el flujo de seguridad. Si el backend toma el `usuarioId` del cuerpo de la peticion, un usuario podria enviar el ID de cualquier otra persona y falsificar la autoria del reporte.
* **La correccion:** Modifique el endpoint para que el `usuarioId` se extraiga **estrictamente de la sesion autenticada en el servidor** (`req.session.usuario.id`).
