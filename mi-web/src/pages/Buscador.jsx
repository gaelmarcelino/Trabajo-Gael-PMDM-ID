
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import '../styles/Buscador.css'

const POR_PAGINA = 12

function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function Buscador() {
  const [viviendas, setViviendas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [provincia, setProvincia] = useState('')
  const [accesibilidad, setAccesibilidad] = useState('')
  const [orden, setOrden] = useState('referencia')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarViviendas() {
      try {
        setCargando(true)
        setError(false)

        const respuesta = await fetch(
          'http://localhost:3001/viviendas',
          { signal: controlador.signal },
        )

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las viviendas')
        }

        const datos = await respuesta.json()
        setViviendas(datos)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(true)
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarViviendas()

    return () => controlador.abort()
  }, [])

  const provincias = useMemo(() => {
    return [...new Set(viviendas.map((v) => v.provincia).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'))
  }, [viviendas])

  const resultados = useMemo(() => {
    const texto = normalizar(busqueda)

    const filtradas = viviendas.filter((vivienda) => {
      // No mostrar viviendas ya adjudicadas.
      if (vivienda.adjudicada === true) return false

      const coincideTexto =
        !texto ||
        normalizar(vivienda.municipio).includes(texto) ||
        normalizar(vivienda.provincia).includes(texto) ||
        normalizar(vivienda.referencia).includes(texto)

      const coincideProvincia =
        !provincia || vivienda.provincia === provincia

      // Si el dato de accesibilidad falta, no se considera
      // automáticamente una vivienda no adaptada.
      const valorAccesibilidad = normalizar(vivienda.accesibilidad)

      const coincideAccesibilidad =
        !accesibilidad ||
        (accesibilidad === 'adaptada' &&
          valorAccesibilidad === 'adaptada') ||
        (accesibilidad === 'no-adaptada' &&
          valorAccesibilidad === 'no adaptada') ||
        (accesibilidad === 'sin-datos' &&
          !valorAccesibilidad)

      return coincideTexto && coincideProvincia && coincideAccesibilidad
    })

    return filtradas.sort((a, b) => {
      if (orden === 'renta') {
        return Number(a.renta) - Number(b.renta)
      }

      if (orden === 'superficie') {
        return Number(b.superficie) - Number(a.superficie)
      }

      return String(a.referencia ?? '').localeCompare(
        String(b.referencia ?? ''),
        'es',
      )
    })
  }, [viviendas, busqueda, provincia, accesibilidad, orden])

  const totalPaginas = Math.ceil(resultados.length / POR_PAGINA)
  const paginaActual = Math.min(pagina, Math.max(totalPaginas, 1))
  const inicio = (paginaActual - 1) * POR_PAGINA
  const viviendasPagina = resultados.slice(inicio, inicio + POR_PAGINA)

  function limpiarFiltros() {
    setBusqueda('')
    setProvincia('')
    setAccesibilidad('')
    setOrden('referencia')
    setPagina(1)
  }

  function cambiarBusqueda(valor) {
    setBusqueda(valor)
    setPagina(1)
  }

  return (
    <div className="pagina-buscador">
      <header className="cabecera-buscador">
        <Link className="logo-teitos" to="/">Teitos</Link>
        <nav aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link className="enlace-activo" to="/viviendas">
            Buscar vivienda
          </Link>
        </nav>
      </header>

      <main className="contenido-buscador">
        <div className="intro-buscador">
          <p className="etiqueta">ENCUENTRA TU HOGAR</p>
          <h1>Buscar vivienda</h1>
          <p>
            Explora las viviendas disponibles y utiliza los filtros
            para encontrar las que se adapten a tus necesidades.
          </p>
        </div>

        <section className="panel-filtros" aria-label="Filtros de búsqueda">
          <div className="campo-buscador campo-texto">
            <label htmlFor="busqueda">Municipio, provincia o referencia</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Ej. Vigo o 26-6-PON-001"
              value={busqueda}
              onChange={(e) => cambiarBusqueda(e.target.value)}
            />
          </div>

          <div className="campo-buscador">
            <label htmlFor="provincia">Provincia</label>
            <select
              id="provincia"
              value={provincia}
              onChange={(e) => {
                setProvincia(e.target.value)
                setPagina(1)
              }}
            >
              <option value="">Todas las provincias</option>
              {provincias.map((nombre) => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </div>

          <div className="campo-buscador">
            <label htmlFor="accesibilidad">Accesibilidad</label>
            <select
              id="accesibilidad"
              value={accesibilidad}
              onChange={(e) => {
                setAccesibilidad(e.target.value)
                setPagina(1)
              }}
            >
              <option value="">Todas</option>
              <option value="adaptada">Adaptada</option>
              <option value="no-adaptada">No adaptada</option>
              <option value="sin-datos">Sin información</option>
            </select>
          </div>

          <div className="campo-buscador">
            <label htmlFor="orden">Ordenar por</label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="referencia">Referencia</option>
              <option value="renta">Menor renta</option>
              <option value="superficie">Mayor superficie</option>
            </select>
          </div>

          <button
            className="boton-limpiar"
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </section>

        {cargando && (
          <p className="estado-buscador" role="status">
            Cargando viviendas...
          </p>
        )}

        {error && (
          <div className="estado-buscador error-buscador" role="alert">
            <h2>No se han podido cargar las viviendas</h2>
            <p>Comprueba que la API esté activa en el puerto 3001.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Volver a intentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <>
            <div className="resumen-resultados" aria-live="polite">
              <h2>Viviendas disponibles</h2>
              <p>
                {resultados.length}{' '}
                {resultados.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>

            {resultados.length === 0 ? (
              <div className="estado-buscador">
                <h3>No hay viviendas con estos criterios</h3>
                <p>Prueba a cambiar la búsqueda o quitar algún filtro.</p>
                <button type="button" onClick={limpiarFiltros}>
                  Ver todas las viviendas
                </button>
              </div>
            ) : (
              <>
                <div className="rejilla-viviendas">
                  {viviendasPagina.map((vivienda) => (
                    <article className="tarjeta-vivienda" key={vivienda.id}>
                      <div className="cabecera-tarjeta-vivienda">
                        <span className="etiqueta-vivienda">
                          {vivienda.tipologia || 'Vivienda'}
                        </span>
                        <span className="referencia-vivienda">
                          {vivienda.referencia}
                        </span>
                      </div>

                      <h3>
                        {vivienda.municipio}, {vivienda.provincia}
                      </h3>

                      <p className="descripcion-vivienda">
                        {vivienda.descripcion ||
                          'Consulta los detalles de esta vivienda.'}
                      </p>

                      <div className="datos-vivienda">
                        <div>
                          <span>Superficie</span>
                          <strong>{vivienda.superficie} m²</strong>
                        </div>
                        <div>
                          <span>Dormitorios</span>
                          <strong>
                            {vivienda.dormitorios === 0
                              ? 'Estudio'
                              : vivienda.dormitorios ?? 'No indicado'}
                          </strong>
                        </div>
                        <div>
                          <span>Renta mensual</span>
                          <strong>
                            {vivienda.renta != null
                              ? `${vivienda.renta} €/mes`
                              : 'No indicada'}
                          </strong>
                        </div>
                      </div>

                      <p className="accesibilidad-vivienda">
                        Accesibilidad:{' '}
                        {vivienda.accesibilidad
                          ? vivienda.accesibilidad
                          : 'Sin información'}
                      </p>

                      <Link
                        className="boton-detalle"
                        to={`/viviendas/${vivienda.id}`}
                      >
                        Ver detalles
                      </Link>
                    </article>
                  ))}
                </div>

                <nav className="paginacion" aria-label="Paginación">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPagina(paginaActual - 1)}
                  >
                    Anterior
                  </button>

                  <span>
                    Página {paginaActual} de {totalPaginas}
                  </span>

                  <button
                    type="button"
                    disabled={paginaActual >= totalPaginas}
                    onClick={() => setPagina(paginaActual + 1)}
                  >
                    Siguiente
                  </button>
                </nav>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Buscador
