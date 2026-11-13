
import { useState } from 'react'
import { guardarSolicitud } from '../api/solicitudes'

export function useSolicitud() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function enviarSolicitud(datos) {
    setCargando(true)
    setError(null)

    try {
      const resultado = await guardarSolicitud(datos)
      return resultado
    } catch (error) {
      setError(error.message)
      return null
    } finally {
      setCargando(false)
    }
  }

  return {
    enviarSolicitud,
    cargando,
    error
  }
}
