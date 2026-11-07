import { useEffect, useState } from 'react'
import { api } from './api'
import Login from './components/Login'
import Equipos from './components/Equipos'
import FormIncidencia from './components/FormIncidencia'
import Incidencias from './components/Incidencias'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [equipos, setEquipos] = useState([])
  const [incidencias, setIncidencias] = useState([])

  // Al abrir la página se pregunta al backend si ya hay sesión (cookie vigente).
  useEffect(() => {
    api('/auth/me')
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  // Cuando hay usuario, se cargan equipos e incidencias.
  useEffect(() => {
    if (!usuario) return
    api('/equipos').then(setEquipos)
    cargarIncidencias()
  }, [usuario])

  function cargarIncidencias() {
    api('/incidencias').then(setIncidencias)
  }

  async function cerrarSesion() {
    await api('/auth/logout', { method: 'POST' })
    setUsuario(null)
  }

  if (cargando) return <p className="contenedor">Cargando...</p>
  if (!usuario) return <Login onLogin={setUsuario} />

  return (
    <div className="contenedor">
      <header>
        <h1>Incidencias del laboratorio</h1>
        <div>
          <span>
            {usuario.nombre} <span className={`rol rol-${usuario.rol}`}>{usuario.rol}</span>
          </span>
          <button onClick={cerrarSesion}>Salir</button>
        </div>
      </header>

      <div className="columnas">
        <Equipos equipos={equipos} />
        <FormIncidencia equipos={equipos} onCreada={cargarIncidencias} />
      </div>

      <Incidencias incidencias={incidencias} usuario={usuario} onCambio={cargarIncidencias} />
    </div>
  )
}
