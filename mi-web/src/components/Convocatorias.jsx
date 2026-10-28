
import { useEffect, useState } from 'react'

function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/convocatorias')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las convocatorias')
        }
        return respuesta.json()
      })
      .then((datos) => {
        setConvocatorias(datos)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  return (
    <section className="seccion-convocatorias" id="convocatorias">
      <div className="encabezado-seccion">
        <div>
          <p className="etiqueta">OPORTUNIDADES DE VIVIENDA</p>
          <h2>Convocatorias</h2>
          <p>Consulta las convocatorias públicas de vivienda.</p>
        </div>

        <span className="contador">
          {convocatorias.length} convocatorias
        </span>
      </div>

      {cargando && (
        <p className="mensaje" role="status">
          Cargando convocatorias...
        </p>
      )}

      {error && (
        <p className="mensaje mensaje-error" role="alert">
          No se han podido cargar las convocatorias.
          Comprueba que la API esté funcionando.
        </p>
      )}

      {!cargando && !error && convocatorias.length === 0 && (
        <p className="mensaje">No hay convocatorias disponibles.</p>
      )}

      {!cargando && !error && convocatorias.length > 0 && (
        <div className="rejilla-convocatorias">
          {convocatorias.slice(0, 6).map((convocatoria) => (
            <article className="tarjeta" key={convocatoria.id}>
              <span className="estado">
                {convocatoria.estado === 'resuelta'
                  ? 'Convocatoria resuelta'
                  : 'Convocatoria pública'}
              </span>

              <h3>{convocatoria.provincia}</h3>

              <p className="codigo">{convocatoria.codigo}</p>

              <div className="detalle-tarjeta">
                <span>Viviendas</span>
                <strong>{convocatoria.unidades}</strong>
              </div>

              <div className="detalle-tarjeta">
                <span>Renta desde</span>
                <strong>{convocatoria.rentaDesde} €/mes</strong>
              </div>

              <div className="detalle-tarjeta">
                <span>Fecha de cierre</span>
                <strong>{convocatoria.fechaCierre}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Convocatorias
