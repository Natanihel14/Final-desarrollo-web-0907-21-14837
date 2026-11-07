// Función común para llamar a la API.
// credentials: 'include' hace que el navegador envíe la cookie de sesión.
export async function api(url, opciones = {}) {
  const res = await fetch(`/api${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  const datos = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(datos.error || `Error ${res.status}`)
  }
  return datos
}
