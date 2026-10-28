
import { useParams } from 'react-router'

function DetalleVivienda() {
  const { id } = useParams()

  return (
    <main style={{ padding: '40px', color: '#17324d' }}>
      <a href="/viviendas">← Volver al buscador</a>

      <h1>Detalle de vivienda</h1>

      <p>Referencia interna: {id}</p>

      <p>
        Aquí mostraremos los datos de la vivienda seleccionada.
      </p>
    </main>
  )
}

export default DetalleVivienda

