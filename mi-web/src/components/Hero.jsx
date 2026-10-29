import { Link } from 'react-router'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-contenido">
        <p className="etiqueta">
          ALQUILER ASEQUIBLE, MÁS CERCA
        </p>

        <h1>Encuentra tu próximo hogar.</h1>

        <p className="hero-texto">
          Te ayudamos a encontrar oportunidades de alquiler asequible
          y consultar las convocatorias públicas de vivienda disponibles.
        </p>

        <div className="hero-botones">
          
<Link to="/viviendas" className="boton boton-principal">
  Buscar vivienda
</Link>


          <a className="boton boton-secundario" href="#convocatorias">
            Ver convocatorias
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero