function TarjetaConvocatoria({ convocatoria, indice }) {
  const ubicacion =
    convocatoria.municipio ||
    convocatoria.provincia ||
    ['Madrid', 'A Coruña', 'Valencia'][indice] ||
    'Ubicación por confirmar'

  const titulo =
    convocatoria.titulo ||
    convocatoria.nombre ||
    `Alquiler asequible en ${ubicacion}`

  const viviendas =
    convocatoria.unidades ??
    convocatoria.viviendasDisponibles ??
    'Pendiente de confirmar'

  const fecha =
    convocatoria.fechaLimite ||
    convocatoria.fechaCierre ||
    'Pendiente de confirmar'

  return (
    <article className="tarjeta-convocatoria">
      <div className="tarjeta-titulo">
        <span className="estado">EJEMPLO PROVISIONAL</span>

        <h3>{titulo}</h3>

        <p className="ubicacion">
          <span aria-hidden="true">⌖</span> {ubicacion}
          {convocatoria.comunidad
            ? ` · ${convocatoria.comunidad}`
            : ''}
        </p>
      </div>

      <div className="dato-convocatoria">
        <span>Viviendas disponibles</span>
        <strong>{viviendas}</strong>
      </div>

      <div className="dato-convocatoria">
        <span>Fecha límite</span>
        <strong>{fecha}</strong>
      </div>

      <a className="boton boton-fila" href="#buscar">
        Ver convocatoria
      </a>
    </article>
  )
}

export default TarjetaConvocatoria