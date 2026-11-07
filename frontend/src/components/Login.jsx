import { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function enviar(e) {
    e.preventDefault()
    setError('')
    try {
      const usuario = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      onLogin(usuario)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="tarjeta login" onSubmit={enviar}>
      <h1>Iniciar sesión</h1>
      <label>
        Usuario
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Contraseña
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Entrar</button>
      <small>Pruebas: ana / ana123 · carlos / carlos123 · tecnico / tecnico123</small>
    </form>
  )
}
