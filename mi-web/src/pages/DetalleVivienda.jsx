
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import './DetalleVivienda.css'

function DetalleVivienda() {
  const { id } = useParams()
  
  const navigate = useNavigate()
  const [vivienda, setVivienda] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarVivienda() {
      try {
        setCargando(true)
        setError('')

        const respuesta = await fetch(
          `http://localhost:3001/viviendas/${id}`
        )

        if (!respuesta.ok) {
          throw new Error('No se ha encontrado esta vivienda.')
        }

        const datos = await respuesta.json()
        setVivienda(datos)
      } catch (err) {
        setError(
          err.message || 'No se han podido cargar los datos.'
        )
      } finally {
        setCargando(false)
      }
    }

    cargarVivienda()
  }, [id])

  if (cargando) {
    return (
      <main className="detalle-estado" aria-live="polite">
        <p>Cargando información de la vivienda...</p>
      </main>
    )
  }

  if (error || !vivienda) {
    return (
      <main className="detalle-estado">
        <h1>No se ha podido mostrar la vivienda</h1>
        <p>{error || 'No se ha encontrado esta vivienda.'}</p>
        <Link className="detalle-volver" to="/viviendas">
          ← Volver al buscador
        </Link>
      </main>
    )
  }

  const accesibilidad = {
    adaptada: 'Adaptada',
    practicable: 'Practicable',
    sin_adaptar: 'Sin adaptar',
  }

  const valorAccesibilidad =
    vivienda.accesibilidad == null ||
    vivienda.accesibilidad === ''
      ? 'Información no disponible'
      : accesibilidad[vivienda.accesibilidad] ||
        vivienda.accesibilidad

  return (
    <div className="pagina-detalle">
      <header className="detalle-cabecera">
        <Link className="detalle-marca" to="/">
          <span className="detalle-logo" aria-hidden="true">
            T
          </span>
          <span>
            <strong>Teitos</strong>
            <small>Tu próximo hogar, más cerca</small>
          </span>
        </Link>

        <nav className="detalle-nav" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/viviendas">Buscador</Link>
        </nav>
      </header>

      <main className="detalle-contenido">
        <Link className="detalle-volver" to="/viviendas">
          ← Volver al buscador
        </Link>

        <section className="detalle-resumen">
          <div className="detalle-introduccion">
            <span className="detalle-etiqueta">
              INFORMACIÓN DE LA VIVIENDA
            </span>

            <h1>
              Vivienda en {vivienda.municipio || 'municipio no disponible'}
            </h1>

            <p className="detalle-ubicacion">
              {vivienda.provincia || 'Provincia no disponible'}
            </p>

            <p className="detalle-referencia">
              Referencia: {vivienda.referencia || 'No disponible'}
            </p>
          </div>

          <aside className="detalle-precio">
            <p>Alquiler mensual</p>

            <strong>
              {vivienda.renta != null
                ? `${vivienda.renta} €`
                : 'No disponible'}
            </strong>

            <span className="detalle-mensual">al mes</span>

            
            <button
            className="detalle-boton"
            type="button"
            onClick={() => navigate(`/solicitud?vivienda=${id}`)}
            >
            Solicitar vivienda
            </button>


            <small>
              Consultar la información no implica presentar una solicitud.
            </small>
          </aside>
        </section>

        <section
          className="detalle-caracteristicas"
          aria-label="Características de la vivienda"
        >
          <article className="detalle-caracteristica">
            <span className="detalle-icono" aria-hidden="true">⌂</span>
            <div>
              <p>Superficie</p>
              <strong>
                {vivienda.superficie != null
                  ? `${vivienda.superficie} m²`
                  : 'No disponible'}
              </strong>
            </div>
          </article>

          <article className="detalle-caracteristica">
            <span className="detalle-icono" aria-hidden="true">▤</span>
            <div>
              <p>Dormitorios</p>
              <strong>{vivienda.dormitorios ?? 'No disponible'}</strong>
            </div>
          </article>

          <article className="detalle-caracteristica">
            <span className="detalle-icono" aria-hidden="true">♿</span>
            <div>
              <p>Accesibilidad</p>
              <strong>{valorAccesibilidad}</strong>
            </div>
          </article>
        </section>

        <section className="detalle-descripcion">
          <h2>Sobre esta vivienda</h2>

          <p>
            {vivienda.descripcion ||
              'No hay una descripción disponible para esta vivienda.'}
          </p>

          <div className="detalle-aviso">
            <span aria-hidden="true">ⓘ</span>
            <p>
              La información se muestra según los datos disponibles
              en el registro de la vivienda. Los datos que no constan
              no se consideran características confirmadas.
            </p>
          </div>
        </section>

        <div className="detalle-acciones">
          <Link className="detalle-boton-secundario" to="/viviendas">
            Ver otras viviendas
          </Link>
        </div>
      </main>

      <footer className="detalle-pie">
        <p>Teitos · Vivienda asequible, oportunidades para todos.</p>
      </footer>
    </div>
  )
}

export default DetalleVivienda


