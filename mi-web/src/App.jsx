
import { BrowserRouter, Routes, Route, Link } from 'react-router'
import './App.css'
import Inicio from './pages/Inicio.jsx'
import Buscador from './pages/Buscador.jsx'
import DetalleVivienda from './pages/DetalleVivienda.jsx'

function NoEncontrada() {
  return (
    <main style={{ padding: '48px 5%', color: '#17324d' }}>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/viviendas" element={<Buscador />} />
        <Route
          path="/viviendas/:id"
          element={<DetalleVivienda />}
        />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
