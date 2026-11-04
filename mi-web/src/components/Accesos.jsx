
import { Link } from 'react-router'

function Accesos() {
  return (
    <section className="seccion-accesos" aria-label="Accesos rápidos">
      <h2>¿Qué necesitas hacer?</h2>

      <div className="rejilla-accesos">
        <Link className="tarjeta-acceso" to="/#convocatorias">
          <span className="icono-acceso" aria-hidden="true">⌂</span>
          <strong>Convocatorias</strong>
          <small>Consulta las oportunidades disponibles.</small>
          <span className="enlace-acceso">Ver convocatorias →</span>
        </Link>

        <Link className="tarjeta-acceso" to="/viviendas">
          <span className="icono-acceso" aria-hidden="true">⌕</span>
          <strong>Buscar vivienda</strong>
          <small>Encuentra una vivienda que se adapte a ti.</small>
          <span className="enlace-acceso">Buscar vivienda →</span>
        </Link>

        <Link className="tarjeta-acceso" to="/mi-solicitud">
          <span className="icono-acceso" aria-hidden="true">☷</span>
          <strong>Mi solicitud</strong>
          <small>Consulta información sobre tu solicitud.</small>
          <span className="enlace-acceso">Consultar solicitud →</span>
        </Link>
      </div>
    </section>
  )
}

export default Accesos
