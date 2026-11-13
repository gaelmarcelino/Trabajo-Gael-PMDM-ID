import { useEffect, useState } from 'react'
import { API_URL } from '../api/config'

export function useViviendas() {
  const [viviendas, setViviendas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarViviendas = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/viviendas`)

        if (!response.ok) {
          throw new Error('No se pudieron cargar las viviendas')
        }

        const data = await response.json()
        setViviendas(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarViviendas()
  }, [])

  return {
    viviendas,
    loading,
    error,
  }
}