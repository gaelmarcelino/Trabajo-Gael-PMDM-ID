
const IPREM_ANUAL = 8400

const PONDERACION = {
  1: 1.00,
  2: 1.15,
  3: 1.30,
  4: 1.45,
  5: 1.60,
  6: 1.75,
}


export function cumpleRequisitosAcceso({
  ingresosAnuales,
  personas,
  rentaMensual,
}) {
  const ingresos = Number(ingresosAnuales)
  const numeroPersonas = Number(personas)
  const renta = Number(rentaMensual)

  if (
    !Number.isFinite(ingresos) ||
    !Number.isFinite(renta) ||
    !Number.isFinite(numeroPersonas) ||
    ingresos <= 0 ||
    renta < 0 ||
    numeroPersonas < 1
  ) {
    return false
  }

  
  const personasPonderadas = Math.min(
    Math.floor(numeroPersonas),
    6
  )

  const ponderacion = PONDERACION[personasPonderadas]

  
  const ingresoMinimo = 2 * IPREM_ANUAL * ponderacion
  const ingresoMaximo = 7.5 * IPREM_ANUAL * ponderacion

 
  const cumpleIngresos =
    ingresos >= ingresoMinimo &&
    ingresos <= ingresoMaximo


  const ingresoMensual = ingresos / 12
  const rentaMaxima = ingresoMensual * 0.30

  const cumpleRenta = renta <= rentaMaxima

  return cumpleIngresos && cumpleRenta
}
