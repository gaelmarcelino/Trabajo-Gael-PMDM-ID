
import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react'

const CLAVE = 'teitos-borrador'

const estadoInicial = {
  datos: {
    nombre: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
    personas: '1',
    ingresos: ''
  },
  viviendas: [],
  paso: 1
}

function cargarEstado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))

    if (!guardado) return estadoInicial

    return {
      datos: {
        ...estadoInicial.datos,
        ...guardado.datos
      },
      viviendas: Array.isArray(guardado.viviendas)
        ? guardado.viviendas.map(String)
        : [],
      paso: guardado.paso === 2 ? 2 : 1
    }
  } catch {
    return estadoInicial
  }
}

function reducer(estado, accion) {
  switch (accion.type) {
    case 'CAMBIAR_CAMPO':
      return {
        ...estado,
        datos: {
          ...estado.datos,
          [accion.campo]: accion.valor
        }
      }

    case 'CAMBIAR_VIVIENDAS':
      return {
        ...estado,
        viviendas: accion.viviendas
      }

    case 'CAMBIAR_PASO':
      return {
        ...estado,
        paso: accion.paso
      }

    case 'LIMPIAR':
      return estadoInicial

    default:
      return estado
  }
}

const SolicitudContext = createContext(null)

export function SolicitudProvider({ children }) {
  const [estado, dispatch] = useReducer(
    reducer,
    estadoInicial,
    cargarEstado
  )

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  }, [estado])

  return (
    <SolicitudContext.Provider value={{ estado, dispatch }}>
      {children}
    </SolicitudContext.Provider>
  )
}

export function useBorradorSolicitud() {
  const contexto = useContext(SolicitudContext)

  if (!contexto) {
    throw new Error(
      'useBorradorSolicitud necesita SolicitudProvider'
    )
  }

  return contexto
}
