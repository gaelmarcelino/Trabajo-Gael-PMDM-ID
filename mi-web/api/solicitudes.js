
import { API_URL } from './config'

export async function guardarSolicitud(solicitud) {
  const respuesta = await fetch(`${API_URL}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(solicitud)
  })

  if (!respuesta.ok) {
    throw new Error('No se pudo guardar la solicitud')
  }

  return await respuesta.json()
}
export async function obtenerVivienda(id) {
  const respuesta = await fetch(`${API_URL}/viviendas/${id}`)

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener la vivienda')
  }

  return await respuesta.json()
}
export async function obtenerConvocatorias() {
  const respuesta = await fetch(`${API_URL}/convocatorias`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las convocatorias')
  }

  return await respuesta.json()
}

export async function obtenerViviendas() {
  const respuesta = await fetch(`${API_URL}/viviendas`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las viviendas')
  }

  return await respuesta.json()
}

