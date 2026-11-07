import { useState } from 'react'
import { api } from '../api'

export default function Incidencias({ incidencias, usuario, onCambio }) {
  const [error, setError] = useState('')

  async function cerrar(id) {
    setError('')
    try {
      await api(`/incidencias/${id}/cerrar`, { method: 'PATCH' })
      onCambio()
    } catch (err) {
      // Si el backend rechaza el cierre (403), se muestra su mensaje.
      setError(err.message)
    }
  }

  // Solo para la interfaz: el backend vuelve a validar esta misma regla.
  const puedeCerrar = (inc) => usuario.rol === 'tecnico' || inc.usuarioId === usuario.id

  return (
    <section className="tarjeta">
      <h2>Incidencias</h2>
      {error && <p className="error">{error}</p>}
      {incidencias.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Descripción</th>
              <th>Registró</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{inc.Equipo?.codigo}</td>
                <td>{inc.descripcion}</td>
                <td>{inc.creador?.nombre}</td>
                <td>
                  <span className={`estado estado-${inc.estado}`}>{inc.estado}</span>
                  {inc.cerradoPor && <small> por {inc.cerradoPor.nombre}</small>}
                </td>
                <td>
                  {inc.estado === 'abierta' && puedeCerrar(inc) && (
                    <button onClick={() => cerrar(inc.id)}>Cerrar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
