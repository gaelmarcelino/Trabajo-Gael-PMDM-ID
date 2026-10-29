import { Link } from 'react-router'
function Cabecera() {
  return (
    <header className="cabecera">
      <a className="logo-teitos" href="#inicio">
        Teitos
      </a>

      <nav className="navegacion" aria-label="Navegación principal">
        <a className="enlace-activo" href="#inicio">Inicio</a>
        <a href="#buscar">Buscar vivienda</a>
        <a href="#convocatorias">Convocatorias</a>
        <a href="#solicitud">Mi solicitud</a>
      </nav>

      <Link className="boton boton-principal" to="/viviendas">
  Buscar vivienda
</Link>
    </header>
  )
}

export default Cabecera