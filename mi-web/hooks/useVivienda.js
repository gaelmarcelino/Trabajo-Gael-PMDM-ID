import { useEffect, useState } from 'react'
import { API_URL } from '../api/config'

export function useVivienda(id) {
  const [vivienda, setVivienda] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarVivienda = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/viviendas/${id}`)

        if (!response.ok) {
          throw new Error('No se pudo cargar la vivienda')
        }

        const data = await response.json()
        setVivienda(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      cargarVivienda()
    }
  }, [id])

  return {
    vivienda,
    loading,
    error,
  }
}