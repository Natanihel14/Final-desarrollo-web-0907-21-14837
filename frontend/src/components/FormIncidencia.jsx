import { useState } from 'react'
import { api } from '../api'

export default function FormIncidencia({ equipos, onCreada }) {
  const [equipoId, setEquipoId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  async function enviar(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/incidencias', {
        method: 'POST',
        body: JSON.stringify({ equipoId: Number(equipoId), descripcion }),
      })
      setEquipoId('')
      setDescripcion('')
      onCreada()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2>Registrar incidencia</h2>
      <label>
        Equipo
        <select value={equipoId} onChange={(e) => setEquipoId(e.target.value)} required>
          <option value="">Seleccione un equipo</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.codigo} - {eq.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Descripción
        <textarea rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Registrar</button>
    </form>
  )
}
