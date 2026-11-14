
import { useState } from 'react'
import {
  obtenerSolicitud,
  obtenerConvocatorias,
  modificarSolicitud,
  eliminarSolicitud
} from '../../api/solicitudes'

export default function MiSolicitud() {
  const [id, setId] = useState(
    () => localStorage.getItem('teitosSolicitudId') || ''
  )
  const [solicitud, setSolicitud] = useState(null)
  const [puedeModificar, setPuedeModificar] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function comprobarConvocatoria(datos) {
    const convocatorias = await obtenerConvocatorias()

    const convocatoria = convocatorias.find(
      c => String(c.id) === String(datos.convocatoriaId)
    )

    if (!convocatoria) {
      throw new Error('No se encontró la convocatoria')
    }

    return String(convocatoria.estado).trim().toLowerCase() === 'abierta'
  }

  async function buscarSolicitud() {
    setError('')
    setMensaje('')
    setSolicitud(null)
    setCargando(true)

    try {
      if (!id.trim()) {
        throw new Error('Introduce un identificador')
      }

      const resultado = await obtenerSolicitud(id.trim())
      const abierta = await comprobarConvocatoria(resultado)

      setSolicitud(resultado)
      setPuedeModificar(abierta)
      localStorage.setItem('teitosSolicitudId', String(resultado.id))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  function actualizarCampo(campo, valor) {
    setSolicitud(anterior => ({
      ...anterior,
      [campo]: valor
    }))
  }

  function validarDatos() {
    if (!solicitud.nombre?.trim() || !solicitud.apellidos?.trim()) {
      throw new Error('El nombre y los apellidos son obligatorios')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(solicitud.email || '')) {
      throw new Error('Introduce un correo electrónico válido')
    }

    if (!/^[0-9]{9}$/.test(String(solicitud.telefono || '').trim())) {
      throw new Error('Introduce un teléfono de 9 números')
    }
  }

  async function guardarCambios() {
    setError('')
    setMensaje('')
    setCargando(true)

    try {
      const abierta = await comprobarConvocatoria(solicitud)

      if (!abierta) {
        setPuedeModificar(false)
        throw new Error(
          'No puedes modificar una solicitud de una convocatoria cerrada'
        )
      }

      validarDatos()

      const resultado = await modificarSolicitud(
        solicitud.id,
        solicitud
      )

      setSolicitud(resultado)
      setMensaje('Solicitud modificada correctamente')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  async function retirarSolicitud() {
    if (!window.confirm('¿Seguro que quieres retirar esta solicitud?')) {
      return
    }

    setError('')
    setMensaje('')
    setCargando(true)

    try {
      await eliminarSolicitud(solicitud.id)
      setSolicitud(null)
      setId('')
      localStorage.removeItem('teitosSolicitudId')
      setMensaje('Solicitud retirada correctamente')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main style={{ padding: '40px 5%', maxWidth: 850, margin: 'auto' }}>
      <h1>Mi solicitud</h1>
      <p>Consulta, modifica o retira tu solicitud.</p>

      <label htmlFor="id-solicitud">Identificador de solicitud</label>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          id="id-solicitud"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="ID de solicitud"
        />

        <button
          type="button"
          onClick={buscarSolicitud}
          disabled={cargando || !id.trim()}
        >
          Buscar
        </button>
      </div>

      {cargando && <p role="status">Cargando...</p>}
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}

      {solicitud && (
        <section style={{ marginTop: 30 }}>
          <h2>Datos de la solicitud</h2>

          <p><strong>ID:</strong> {solicitud.id}</p>
          <p><strong>Convocatoria:</strong> {solicitud.convocatoriaId}</p>

          {!puedeModificar && (
            <p role="status">
              Esta convocatoria no está abierta. Puedes consultar
              o retirar la solicitud, pero no modificarla.
            </p>
          )}

          {[
            ['nombre', 'Nombre'],
            ['apellidos', 'Apellidos'],
            ['telefono', 'Teléfono'],
            ['email', 'Correo electrónico']
          ].map(([campo, etiqueta]) => (
            <div key={campo} style={{ marginBottom: 16 }}>
              <label htmlFor={campo}>{etiqueta}</label>
              <input
                id={campo}
                type={campo === 'email' ? 'email' : 'text'}
                value={solicitud[campo] || ''}
                disabled={!puedeModificar || cargando}
                onChange={e => actualizarCampo(campo, e.target.value)}
                style={{ display: 'block', width: '100%', maxWidth: 450 }}
              />
            </div>
          ))}

          <h3>Viviendas por orden de preferencia</h3>

          <ol>
            {(solicitud.viviendas || []).map(viviendaId => (
              <li key={viviendaId}>Vivienda {viviendaId}</li>
            ))}
          </ol>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {puedeModificar && (
              <button
                type="button"
                onClick={guardarCambios}
                disabled={cargando}
              >
                Guardar cambios
              </button>
            )}

            <button
              type="button"
              onClick={retirarSolicitud}
              disabled={cargando}
            >
              Retirar solicitud
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
