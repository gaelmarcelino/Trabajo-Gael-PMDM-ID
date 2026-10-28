
import { BrowserRouter, Routes, Route, Link } from 'react-router'
import './App.css'
import Inicio from './pages/Inicio.jsx'
import Buscador from './pages/Buscador.jsx'

function DetallePendiente() {
  return (
    <main style={{ padding: '48px 5%', color: '#17324d' }}>
      <h1>Detalle de vivienda</h1>
      <p>Esta página la desarrollaremos en el siguiente paso.</p>
      <Link to="/viviendas">Volver al buscador</Link>
    </main>
  )
}

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
        <Route path="/viviendas/:id" element={<DetallePendiente />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

