
function Accesos() {
  return (
    <section className="accesos" aria-label="Accesos rápidos">
      <a className="acceso" href="#convocatorias">
        <span className="icono-acceso" aria-hidden="true">⌂</span>
        <span>
          <strong>Convocatorias</strong>
          <small>Consulta las oportunidades disponibles.</small>
        </span>
        <span className="flecha" aria-hidden="true">→</span>
      </a>

      <a className="acceso" href="#buscar">
        <span className="icono-acceso" aria-hidden="true">⌕</span>
        <span>
          <strong>Buscar vivienda</strong>
          <small>Encuentra una vivienda que se adapte a ti.</small>
        </span>
        <span className="flecha" aria-hidden="true">→</span>
      </a>

      <a className="acceso" href="#solicitud">
        <span className="icono-acceso" aria-hidden="true">☷</span>
        <span>
          <strong>Mi solicitud</strong>
          <small>Consulta información sobre tu solicitud.</small>
        </span>
        <span className="flecha" aria-hidden="true">→</span>
      </a>
    </section>
  )
}

export default Accesos
