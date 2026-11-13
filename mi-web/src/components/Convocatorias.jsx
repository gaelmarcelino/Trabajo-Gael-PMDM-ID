import { useConvocatorias } from "../../hooks/useConvocatorias";

function Convocatorias() {
  const {
    convocatorias,
    loading,
    error
  } = useConvocatorias()

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

      {loading && (
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

      {!loading && !error && convocatorias.length === 0 && (
        <p className="mensaje">
          No hay convocatorias disponibles.
        </p>
      )}

      {!loading && !error && convocatorias.length > 0 && (
        <div className="rejilla-convocatorias">
          {convocatorias.map((convocatoria) => (
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