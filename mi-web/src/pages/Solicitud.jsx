
import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import './Solicitud.css'
import { useSolicitud } from '../../hooks/useSolicitud'
import { obtenerVivienda, obtenerViviendas, obtenerConvocatorias } from '../../api/solicitudes'
import { useBorradorSolicitud } from '../context/SolicitudContext.jsx'

function Solicitud() {
  const { enviarSolicitud, cargando, error } = useSolicitud()
  const [parametros] = useSearchParams()
  const viviendaId = parametros.get('vivienda')
  const { estado, dispatch } = useBorradorSolicitud()
  const paso = estado.paso
  const datos = estado.datos
  const viviendasSeleccionadas = estado.viviendas
  const setPaso = paso => dispatch({ type: 'CAMBIAR_PASO', paso })
  const setViviendasSeleccionadas = actualizar => {
    const viviendas = typeof actualizar === 'function' ? actualizar(estado.viviendas) : actualizar
    dispatch({ type: 'CAMBIAR_VIVIENDAS', viviendas })
  }

  const [revision, setRevision] = useState(false)
  const [errores, setErrores] = useState({})


  const [viviendasDisponibles, setViviendasDisponibles] = useState([])
  const [cargandoViviendas, setCargandoViviendas] = useState(true)
  const [errorViviendas, setErrorViviendas] = useState('')

  useEffect(() => {
    let cancelado = false

    async function cargarViviendas() {
      setCargandoViviendas(true)
      setErrorViviendas('')
      setViviendasDisponibles([])

      try {
        if (!viviendaId) {
          throw new Error('Primero debes seleccionar una vivienda')
        }

        const viviendaActual = await obtenerVivienda(viviendaId)
        const convocatorias = await obtenerConvocatorias()

        const convocatoria = convocatorias.find(
          c => String(c.id) === String(viviendaActual.convocatoriaId)
        )

        if (!convocatoria ||
            String(convocatoria.estado).trim().toLowerCase() !== 'abierta') {
          throw new Error('La convocatoria de esta vivienda no está abierta')
        }

        if (viviendaActual.adjudicada) {
          throw new Error('Esta vivienda ya está adjudicada')
        }

        const todas = await obtenerViviendas()

        const disponibles = todas.filter(
          vivienda =>
            String(vivienda.convocatoriaId) ===
              String(viviendaActual.convocatoriaId) &&
            vivienda.adjudicada === false
        )

        if (!cancelado) {
          setViviendasDisponibles(disponibles)
          // Mantener preferencias si pertenecen a la misma convocatoria.
          // Si se inicia desde otra convocatoria, comenzar una selección nueva.
          const anteriores = String(estado.convocatoriaId) === String(viviendaActual.convocatoriaId)
            ? estado.viviendas.filter(id => disponibles.some(v => String(v.id) === id))
            : []
          const inicial = String(viviendaActual.id)
          dispatch({
            type: 'SINCRONIZAR_VIVIENDAS',
            convocatoriaId: String(viviendaActual.convocatoriaId),
            viviendas: anteriores.includes(inicial) ? anteriores : [inicial, ...anteriores]
          })
        }
      } catch (error) {
        if (!cancelado) {
          setErrorViviendas(error.message)
        }
      } finally {
        if (!cancelado) {
          setCargandoViviendas(false)
        }
      }
    }

    cargarViviendas()

    return () => {
      cancelado = true
    }
  }, [viviendaId])

  function actualizarCampo(evento) {
    const { name, value } = evento.target

    dispatch({ type: 'CAMBIAR_CAMPO', campo: name, valor: value })
  }

  function agregarVivienda(id) {
    const idTexto = String(id)

    if (!viviendasDisponibles.some(
      vivienda => String(vivienda.id) === idTexto
    )) {
      return
    }

    setViviendasSeleccionadas(anteriores => {
      if (anteriores.includes(idTexto)) {
        return anteriores
      }

      return [...anteriores, idTexto]
    })
  }

  function quitarVivienda(id) {
    setViviendasSeleccionadas(anteriores => {
      if (anteriores.length <= 1) {
        return anteriores
      }

      return anteriores.filter(
        vivienda => vivienda !== String(id)
      )
    })
  }

  function moverVivienda(indice, direccion) {
    setViviendasSeleccionadas(anteriores => {
      const nuevoIndice = indice + direccion

      if (nuevoIndice < 0 || nuevoIndice >= anteriores.length) {
        return anteriores
      }

      const lista = [...anteriores]

      const temporal = lista[indice]
      lista[indice] = lista[nuevoIndice]
      lista[nuevoIndice] = temporal

      return lista
    })
  }

  function validarPaso() {
    const nuevosErrores = {}

    if (paso === 1) {
      if (!datos.nombre.trim()) {
        nuevosErrores.nombre = 'Introduce tu nombre'
      }

      if (!datos.apellidos.trim()) {
        nuevosErrores.apellidos = 'Introduce tus apellidos'
      }

      if (!datos.documento.trim()) {
        nuevosErrores.documento = 'Introduce tu documento'
      }

      if (!datos.email.trim()) {
        nuevosErrores.email = 'Introduce tu correo electrónico'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
        nuevosErrores.email = 'Introduce un correo válido'
      }

      if (!datos.telefono.trim()) {
        nuevosErrores.telefono = 'Introduce tu teléfono'
      }
    }

    if (paso === 2) {
      if (Number(datos.personas) < 1) {
        nuevosErrores.personas = 'Indica el número de personas'
      }

      if (
        datos.ingresos === '' ||
        !Number.isFinite(Number(datos.ingresos)) ||
        Number(datos.ingresos) <= 0
      ) {
        nuevosErrores.ingresos = 'Introduce unos ingresos anuales válidos'
      }

      if (viviendasSeleccionadas.length === 0) {
        nuevosErrores.viviendas = 'Selecciona al menos una vivienda'
      }
    }

    setErrores(nuevosErrores)

    return Object.keys(nuevosErrores).length === 0
  }

  function siguientePaso() {
    if (validarPaso()) {
      setPaso(2)
    }
  }

  function enviarRevision(evento) {
    evento.preventDefault()

    if (validarPaso() && !cargandoViviendas && !errorViviendas) {
      setRevision(true)
    }
  }

  async function guardarDatos() {
    if (
      cargandoViviendas ||
      errorViviendas ||
      viviendasSeleccionadas.length === 0
    ) {
      return
    }

    const nuevaSolicitud = {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      documento: datos.documento,
      email: datos.email,
      telefono: datos.telefono,
      personas: Number(datos.personas),
      ingresos: Number(datos.ingresos),
      viviendaId: viviendasSeleccionadas[0],
      viviendas: viviendasSeleccionadas
    }

    const resultado = await enviarSolicitud(nuevaSolicitud)

    if (resultado) {
      dispatch({ type: 'LIMPIAR' })
      try { localStorage.setItem('teitosSolicitudId', String(resultado.id)) } catch { /* almacenamiento no disponible */ }
      alert('Solicitud guardada correctamente. ID: ' + resultado.id)
    }
  }

  if (revision) {
    return (
      <main className="pagina-solicitud">
        <section className="formulario-solicitud">
          <h1>Revisa tu solicitud</h1>
          <p>Comprueba los datos antes de guardar.</p>

          <h2>Datos personales</h2>
          <p>{datos.nombre} {datos.apellidos}</p>
          <p>Documento: {datos.documento}</p>
          <p>{datos.email}</p>
          <p>{datos.telefono}</p>

          <h2>Unidad familiar</h2>
          <p>Personas: {datos.personas}</p>
          <p>Ingresos anuales: {datos.ingresos} €</p>

          <h2>Viviendas por orden de preferencia</h2>

          {viviendasSeleccionadas.map((id, indice) => (
            <p key={id}>
              {indice + 1}. Vivienda {id}
            </p>
          ))}

          <button
            type="button"
            onClick={() => setRevision(false)}
          >
            Volver a editar
          </button>

          <button
            type="button"
            onClick={guardarDatos}
            disabled={cargando || cargandoViviendas || !!errorViviendas}
          >
            {cargando ? 'Guardando...' : 'Confirmar y guardar solicitud'}
          </button>

          {error && <p role="alert">{error}</p>}
        </section>
      </main>
    )
  }

  return (
    <main className="pagina-solicitud">
      <section className="formulario-solicitud">
        <p className="etiqueta">TEITOS · SOLICITUD DE VIVIENDA</p>

        <h1>Solicita tu vivienda</h1>

        {viviendaId && (
          <p>Vivienda inicial: {viviendaId}</p>
        )}

        <div className="progreso-solicitud">
          <span className={paso >= 1 ? 'paso-activo' : ''}>
            1. Datos personales
          </span>
          <span className={paso >= 2 ? 'paso-activo' : ''}>
            2. Unidad familiar y viviendas
          </span>
          <span className={revision ? 'paso-activo' : ''}>
            3. Revisión
          </span>
        </div>

        <form onSubmit={enviarRevision}>
          {paso === 1 && (
            <div className="campos-solicitud">
              <h2>Datos personales</h2>
              <p>Introduce tus datos de contacto.</p>

              <label>
                Nombre
                <input
                  name="nombre"
                  value={datos.nombre}
                  onChange={actualizarCampo}
                />
                {errores.nombre && <span role="alert">{errores.nombre}</span>}
              </label>

              <label>
                Apellidos
                <input
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={actualizarCampo}
                />
                {errores.apellidos && <span role="alert">{errores.apellidos}</span>}
              </label>

              <label>
                Documento identificativo
                <input
                  name="documento"
                  value={datos.documento}
                  onChange={actualizarCampo}
                />
                {errores.documento && <span role="alert">{errores.documento}</span>}
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={datos.email}
                  onChange={actualizarCampo}
                />
                {errores.email && <span role="alert">{errores.email}</span>}
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="telefono"
                  value={datos.telefono}
                  onChange={actualizarCampo}
                />
                {errores.telefono && <span role="alert">{errores.telefono}</span>}
              </label>
            </div>
          )}

          {paso === 2 && (
            <div className="campos-solicitud">
              <h2>Unidad familiar</h2>
              <p>Indica la información económica y familiar.</p>

              <label>
                Número de personas del hogar
                <select
                  name="personas"
                  value={datos.personas}
                  onChange={actualizarCampo}
                >
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6">6 o más personas</option>
                </select>
                {errores.personas && <span role="alert">{errores.personas}</span>}
              </label>

              <label>
                Ingresos netos anuales del hogar (€)
                <input
                  type="number"
                  min="0"
                  name="ingresos"
                  value={datos.ingresos}
                  onChange={actualizarCampo}
                />
                {errores.ingresos && <span role="alert">{errores.ingresos}</span>}
              </label>

              <h2>Viviendas por orden de preferencia</h2>

              {cargandoViviendas && <p>Cargando viviendas...</p>}
              {errorViviendas && <p role="alert">{errorViviendas}</p>}
              {errores.viviendas && <p role="alert">{errores.viviendas}</p>}

              {!cargandoViviendas && !errorViviendas && (
                <>
                  <h3>Viviendas seleccionadas</h3>

                  {viviendasSeleccionadas.map((id, indice) => (
                    <div key={id}>
                      <p>{indice + 1}. Vivienda {id}</p>

                      <button
                        type="button"
                        onClick={() => moverVivienda(indice, -1)}
                        disabled={indice === 0}
                      >
                        Subir
                      </button>

                      <button
                        type="button"
                        onClick={() => moverVivienda(indice, 1)}
                        disabled={indice === viviendasSeleccionadas.length - 1}
                      >
                        Bajar
                      </button>

                      <button
                        type="button"
                        onClick={() => quitarVivienda(id)}
                        disabled={viviendasSeleccionadas.length === 1}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}

                  <h3>Añadir otra vivienda</h3>

                  {viviendasDisponibles
                    .filter(
                      vivienda =>
                        !viviendasSeleccionadas.includes(String(vivienda.id))
                    )
                    .map(vivienda => (
                      <div key={vivienda.id}>
                        <span>
                          Vivienda {vivienda.id} - {vivienda.renta} €/mes
                        </span>

                        <button
                          type="button"
                          onClick={() => agregarVivienda(vivienda.id)}
                        >
                          Añadir
                        </button>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}

          <div className="acciones-solicitud">
            {paso > 1 && (
              <button type="button" onClick={() => setPaso(1)}>
                Anterior
              </button>
            )}

            {paso === 1 && (
              <button type="button" onClick={siguientePaso}>
                Continuar
              </button>
            )}

            {paso === 2 && (
              <button
                type="submit"
                disabled={cargandoViviendas || !!errorViviendas}
              >
                Revisar solicitud
              </button>
            )}
          </div>
        </form>

        <Link to="/viviendas">Volver al buscador</Link>
      </section>
    </main>
  )
}

export default Solicitud
