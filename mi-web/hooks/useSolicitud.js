
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
      // Obtener las viviendas seleccionadas
      const ids = datos.viviendas

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Debes seleccionar al menos una vivienda')
      }

      // Evitar viviendas repetidas
      const idsTexto = ids.map(id => String(id))

      if (new Set(idsTexto).size !== idsTexto.length) {
        throw new Error('No puedes seleccionar viviendas repetidas')
      }

      // Consultar cada vivienda en la API
      const viviendas = await Promise.all(
        idsTexto.map(id => obtenerVivienda(id))
      )

      // La primera vivienda determina la convocatoria
      const convocatoriaId = viviendas[0].convocatoriaId

      // Consultar las convocatorias
      const convocatorias = await obtenerConvocatorias()

      const convocatoria = convocatorias.find(
        c => String(c.id) === String(convocatoriaId)
      )

      if (!convocatoria) {
        throw new Error('No se encontró la convocatoria')
      }

      if (String(convocatoria.estado).trim().toLowerCase() !== 'abierta') {
        throw new Error('La convocatoria no está abierta')
      }

      // Comprobar todas las viviendas
      for (const vivienda of viviendas) {

        if (String(vivienda.convocatoriaId) !== String(convocatoriaId)) {
          throw new Error(
            'Todas las viviendas deben pertenecer a la misma convocatoria'
          )
        }

        if (vivienda.adjudicada) {
          throw new Error(
            'La vivienda ' + vivienda.id + ' ya está adjudicada'
          )
        }

        const cumpleAcceso = cumpleRequisitosAcceso({
          ingresosAnuales: datos.ingresos,
          personas: datos.personas,
          rentaMensual: vivienda.renta
        })

        if (!cumpleAcceso) {
          throw new Error(
            'No cumples los requisitos económicos para la vivienda ' +
            vivienda.id
          )
        }
      }

      // Guardar todas las viviendas en el orden elegido
      const solicitudCompleta = {
        ...datos,
        viviendaId: idsTexto[0],
        convocatoriaId: convocatoriaId,
        viviendas: idsTexto
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


