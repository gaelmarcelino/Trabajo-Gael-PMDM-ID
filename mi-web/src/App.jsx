
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [convocatorias, setConvocatorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

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
        setCargando(false)
      })
      .catch(() => {
        setError('No se han podido cargar los datos. Comprueba que la API está encendida.')
        setCargando(false)
      })
  }, [])

  return (
    <div className="pagina">
      <header className="cabecera">
        <a className="logo-teitos" href="#inicio">teitos<span>.</span></a>

        <nav className="navegacion">
          <a href="#inicio">Inicio</a>
          <a href="#buscar">Buscar vivienda</a>
          <a href="#convocatorias">Convocatorias</a>
          <a href="#solicitud">Mi solicitud</a>
        </nav>

        <a className="boton boton-cabecera" href="#buscar">
          Buscar vivienda
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-contenido">
            <p className="etiqueta">VIVIENDA ASEQUIBLE PARA TODOS</p>
            <h1>Encuentra tu próximo hogar.</h1>
            <p className="hero-texto">
              Te ayudamos a encontrar viviendas asequibles y a consultar
              convocatorias para dar el siguiente paso hacia tu nuevo hogar.
            </p>
            <div className="hero-botones">
              <a className="boton boton-principal" href="#buscar">
                Buscar vivienda
              </a>
              <a className="boton boton-secundario" href="#convocatorias">
                Ver convocatorias
              </a>
            </div>
          </div>

          <div className="hero-ilustracion" aria-label="Ilustración de viviendas">
            <div className="sol"></div>
            <div className="edificio edificio-uno">
              <div className="ventanas">
                {Array.from({ length: 6 }, (_, i) => <span key={i}></span>)}
              </div>
            </div>
            <div className="edificio edificio-dos">
              <div className="ventanas">
                {Array.from({ length: 8 }, (_, i) => <span key={i}></span>)}
              </div>
              <div className="balcones"></div>
            </div>
            <div className="suelo"></div>
            <div className="arbusto arbusto-uno"></div>
            <div className="arbusto arbusto-dos"></div>
          </div>
        </section>

        <section className="seccion-convocatorias" id="convocatorias">
          <div className="encabezado-seccion">
            <div>
              <p className="etiqueta">DA EL SIGUIENTE PASO</p>
              <h2>Convocatorias</h2>
              <p>Consulta las oportunidades disponibles para acceder a una vivienda.</p>
            </div>
            <span className="contador">
              {convocatorias.length} convocatorias
            </span>
          </div>

          {cargando && <p className="mensaje">Cargando convocatorias...</p>}

          {error && <p className="mensaje mensaje-error">{error}</p>}

          {!cargando && !error && convocatorias.length === 0 && (
            <p className="mensaje">No hay convocatorias para mostrar.</p>
          )}

          {!cargando && !error && convocatorias.length > 0 && (
            <div className="rejilla-convocatorias">
              {convocatorias.slice(0, 3).map((convocatoria) => (
                <article className="tarjeta" key={convocatoria.id}>
                  <span className="estado">
                    {convocatoria.estado || 'Convocatoria'}
                  </span>
                  <h3>{convocatoria.provincia || 'Ubicación no indicada'}</h3>
                  <p className="codigo">
                    {convocatoria.codigo || `Convocatoria ${convocatoria.id}`}
                  </p>

                  <div className="detalle-tarjeta">
                    <span>Viviendas</span>
                    <strong>{convocatoria.unidades ?? 'Consultar detalles'}</strong>
                  </div>

                  {convocatoria.rentaDesde != null && (
                    <div className="detalle-tarjeta">
                      <span>Renta desde</span>
                      <strong>{convocatoria.rentaDesde} €/mes</strong>
                    </div>
                  )}

                  <div className="detalle-tarjeta">
                    <span>Apertura</span>
                    <strong>{convocatoria.fechaApertura || 'Por confirmar'}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="accesos" id="buscar">
          <a className="acceso" href="#convocatorias">
            <span className="icono-acceso">⌕</span>
            <span>
              <strong>Buscar viviendas</strong>
              <small>Explora las opciones disponibles.</small>
            </span>
            <span className="flecha">→</span>
          </a>

          <a className="acceso" href="#convocatorias">
            <span className="icono-acceso">▤</span>
            <span>
              <strong>Consultar convocatorias</strong>
              <small>Revisa la información y los plazos.</small>
            </span>
            <span className="flecha">→</span>
          </a>

          <a className="acceso" href="#solicitud">
            <span className="icono-acceso">♧</span>
            <span>
              <strong>Mi solicitud</strong>
              <small>Accede a la información de tu solicitud.</small>
            </span>
            <span className="flecha">→</span>
          </a>
        </section>
      </main>

      <footer className="pie" id="solicitud">
        <a className="logo-teitos" href="#inicio">teitos<span>.</span></a>
        <p>Vivienda asequible, nuevas oportunidades.</p>
        <div>
          <a href="#inicio">Inicio</a>
          <a href="#buscar">Buscar vivienda</a>
          <a href="#convocatorias">Convocatorias</a>
          <a href="#solicitud">Contacto</a>
          <a href="#solicitud">Accesibilidad</a>
          <a href="#solicitud">Privacidad</a>
        </div>
      </footer>
    </div>
  )
}

export default App

