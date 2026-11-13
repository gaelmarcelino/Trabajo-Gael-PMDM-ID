
import { useState } from 'react'
import {
  guardarSolicitud,
  obtenerVivienda,
  obtenerConvocatorias
} from '../api/solicitudes'
import { cumpleRequisitosAcceso } from '../reglas/acceso'

export function useSolicitud() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function enviarSolicitud(datos) {
    setCargando(true)
    setError(null)

    try {
      const vivienda = await obtenerVivienda(datos.viviendaId)
      const convocatorias = await obtenerConvocatorias()

      const convocatoria = convocatorias.find(
        c => String(c.id) === String(vivienda.convocatoriaId)
      )

      if (vivienda.adjudicada) {
        throw new Error('Esta vivienda ya está adjudicada')
      }

      if (!convocatoria) {
        throw new Error('No se encontró la convocatoria')
      }

      if (String(convocatoria.estado).trim().toLowerCase() !== 'abierta') {
        throw new Error('La convocatoria no está abierta')
      }

      const cumpleAcceso = cumpleRequisitosAcceso({
        ingresosAnuales: datos.ingresos,
        personas: datos.personas,
        rentaMensual: vivienda.renta
      })

      if (!cumpleAcceso) {
        throw new Error(
          'No cumples los requisitos económicos para solicitar esta vivienda'
        )
      }

      const solicitudCompleta = {
        ...datos,
        convocatoriaId: vivienda.convocatoriaId,
        viviendas: [String(vivienda.id)]
      }

      const resultado = await guardarSolicitud(solicitudCompleta)

      return resultado

    } catch (error) {
      setError(error.message)
      return null

    } finally {
      setCargando(false)
    }
  }

  return { enviarSolicitud, cargando, error }
}

