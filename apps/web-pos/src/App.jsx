import { useState } from 'react'
import logo from './assets/logo.svg'
import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      <img src={logo} alt="Nova Salud Logo" style={{ width: '200px', marginBottom: '20px' }} />
      <h1>Nova Salud POS</h1>
      <p style={{ color: '#94a3b8' }}>El sistema base se ha inicializado correctamente.</p>
      <p style={{ color: '#10b981', marginTop: '20px', fontWeight: 'bold' }}>Esperando código de UI Empresarial...</p>
    </div>
  )
}

export default App
