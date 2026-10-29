import Cabecera from '../components/Cabecera.jsx'
import Hero from '../components/Hero.jsx'
import Convocatorias from '../components/Convocatorias.jsx'
import Accesos from '../components/Accesos.jsx'

import './Inicio.css'

function Inicio() {
  return (
    <div className="pagina">
      <Cabecera />

      <main>
        <Hero />
        <Convocatorias />
        <Accesos />
      </main>

      
    </div>
  )
}

export default Inicio