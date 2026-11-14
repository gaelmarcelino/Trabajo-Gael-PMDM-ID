
import { useState } from 'react'
import {
  obtenerSolicitud,
  modificarSolicitud,
  eliminarSolicitud
} from '../../api/solicitudes'

export default function MiSolicitud() {
  const [id, setId] = useState('')
  const [solicitud, setSolicitud] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function buscarSolicitud() {
    setError('')
    setMensaje('')
    setSolicitud(null)
    setCargando(true)

    try {
      const resultado = await obtenerSolicitud(id.trim())
      setSolicitud(resultado)
    } catch {
      setError('No se encontró la solicitud')
    } finally {
      setCargando(false)
    }
  }

  async function guardarCambios() {
    setError('')
    setMensaje('')
    setCargando(true)

    try {
      const resultado = await modificarSolicitud(
        solicitud.id,
        solicitud
      )

      setSolicitud(resultado)
      setMensaje('Solicitud modificada correctamente')
    } catch {
      setError('No se pudo modificar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  async function retirarSolicitud() {
    const confirmar = window.confirm(
      '¿Seguro que quieres retirar esta solicitud?'
    )

    if (!confirmar) return

    setError('')
    setMensaje('')
    setCargando(true)

    try {
      await eliminarSolicitud(solicitud.id)
      setSolicitud(null)
      setId('')
      setMensaje('Solicitud retirada correctamente')
    } catch {
      setError('No se pudo retirar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main style={{ padding: '40px 5%', maxWidth: '850px', margin: 'auto' }}>
      <h1>Mi solicitud</h1>
      <p>Introduce el identificador de tu solicitud para consultarla.</p>

      <label htmlFor="id-solicitud">Identificador de solicitud</label>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          id="id-solicitud"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Ejemplo: 1"
        />

        <button
          onClick={buscarSolicitud}
          disabled={cargando || !id.trim()}
        >
          Buscar
        </button>
      </div>

      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}

      {solicitud && (
        <section style={{ marginTop: '30px' }}>
          <h2>Datos de la solicitud</h2>

          <p><strong>ID:</strong> {solicitud.id}</p>
          <p><strong>Convocatoria:</strong> {solicitud.convocatoriaId}</p>

          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={solicitud.nombre || ''}
            onChange={e => setSolicitud({
              ...solicitud,
              nombre: e.target.value
            })}
          />

          <label htmlFor="apellidos">Apellidos</label>
          <input
            id="apellidos"
            value={solicitud.apellidos || ''}
            onChange={e => setSolicitud({
              ...solicitud,
              apellidos: e.target.value
            })}
          />

          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            value={solicitud.telefono || ''}
            onChange={e => setSolicitud({
              ...solicitud,
              telefono: e.target.value
            })}
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={solicitud.email || ''}
            onChange={e => setSolicitud({
              ...solicitud,
              email: e.target.value
            })}
          />

          <h3>Viviendas por orden de preferencia</h3>

          <ol>
            {(solicitud.viviendas || []).map(viviendaId => (
              <li key={viviendaId}>Vivienda {viviendaId}</li>
            ))}
          </ol>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '25px',
            flexWrap: 'wrap'
          }}>
            <button onClick={guardarCambios} disabled={cargando}>
              Guardar cambios
            </button>

            <button
              onClick={retirarSolicitud}
              disabled={cargando}
              style={{ backgroundColor: '#b42318', color: 'white' }}
            >
              Retirar solicitud
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
