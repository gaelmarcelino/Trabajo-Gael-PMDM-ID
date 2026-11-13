import { useEffect, useState } from 'react'
import { API_URL } from '../api/config'

export function useConvocatorias() {
  const [convocatorias, setConvocatorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/convocatorias`)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las convocatorias')
        }

        return respuesta.json()
      })
      .then((datos) => {
        setConvocatorias(datos)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return {
    convocatorias,
    loading,
    error,
  }
}