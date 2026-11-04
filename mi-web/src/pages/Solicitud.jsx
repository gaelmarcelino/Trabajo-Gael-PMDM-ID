
import { useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import './Solicitud.css'

function Solicitud() {
  const [parametros] = useSearchParams()
  const viviendaId = parametros.get('vivienda')

  const [paso, setPaso] = useState(1)
  const [datos, setDatos] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
    personas: '1',
    ingresos: '',
  })

  const [errores, setErrores] = useState({})
  const [revision, setRevision] = useState(false)

  function actualizarCampo(evento) {
    const { name, value } = evento.target

    setDatos((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }))
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
      if (!datos.personas || Number(datos.personas) < 1) {
        nuevosErrores.personas = 'Indica el número de personas'
      }

      if (datos.ingresos === '' || Number(datos.ingresos) < 0) {
        nuevosErrores.ingresos = 'Introduce los ingresos anuales'
      }
    }

    setErrores(nuevosErrores)

    return Object.keys(nuevosErrores).length === 0
  }

  function siguientePaso() {
    if (validarPaso()) {
      setPaso(paso + 1)
    }
  }

  function enviarRevision(evento) {
    evento.preventDefault()

    if (validarPaso()) {
      setRevision(true)
    }
  }

  if (revision) {
    return (
      <main className="pagina-solicitud">
        <section className="formulario-solicitud">
          <h1>Revisa tu solicitud</h1>
          <p>Comprueba que los datos sean correctos antes de continuar.</p>

          <h2>Datos personales</h2>
          <p>{datos.nombre} {datos.apellidos}</p>
          <p>{datos.email}</p>
          <p>{datos.telefono}</p>

          <h2>Unidad familiar</h2>
          <p>Personas: {datos.personas}</p>
          <p>Ingresos anuales: {datos.ingresos} €</p>

          <button type="button" onClick={() => setRevision(false)}>
            Volver a editar
          </button>
          <p>La conexión para enviar y guardar la solicitud la añadiremos después.</p>
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
          <p>Vivienda seleccionada: {viviendaId}</p>
        )}

        <div className="progreso-solicitud">
          <span className={paso >= 1 ? 'paso-activo' : ''}>1. Datos personales</span>
          <span className={paso >= 2 ? 'paso-activo' : ''}>2. Unidad familiar</span>
          <span className={paso >= 3 ? 'paso-activo' : ''}>3. Revisión</span>
        </div>

        <form onSubmit={enviarRevision}>
          {paso === 1 && (
            <div className="campos-solicitud">
              <h2>Datos personales</h2>
              <p>Introduce tus datos de contacto.</p>

              <label>
                Nombre
                <input name="nombre" value={datos.nombre} onChange={actualizarCampo} />
                {errores.nombre && <span role="alert">{errores.nombre}</span>}
              </label>

              <label>
                Apellidos
                <input name="apellidos" value={datos.apellidos} onChange={actualizarCampo} />
                {errores.apellidos && <span role="alert">{errores.apellidos}</span>}
              </label>

              <label>
                Documento identificativo
                <input name="documento" value={datos.documento} onChange={actualizarCampo} />
                {errores.documento && <span role="alert">{errores.documento}</span>}
              </label>

              <label>
                Correo electrónico
                <input type="email" name="email" value={datos.email} onChange={actualizarCampo} />
                {errores.email && <span role="alert">{errores.email}</span>}
              </label>

              <label>
                Teléfono
                <input type="tel" name="telefono" value={datos.telefono} onChange={actualizarCampo} />
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
                <select name="personas" value={datos.personas} onChange={actualizarCampo}>
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
            </div>
          )}

          <div className="acciones-solicitud">
            {paso > 1 && (
              <button type="button" onClick={() => setPaso(paso - 1)}>
                Anterior
              </button>
            )}

            {paso < 2 && (
              <button type="button" onClick={siguientePaso}>
                Continuar
              </button>
            )}

            {paso === 2 && (
              <button type="submit">
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
