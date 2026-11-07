export default function Equipos({ equipos }) {
  return (
    <section className="tarjeta">
      <h2>Equipos</h2>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((eq) => (
            <tr key={eq.id}>
              <td>{eq.codigo}</td>
              <td>{eq.nombre}</td>
              <td>{eq.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
