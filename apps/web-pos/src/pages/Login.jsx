import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/pos');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Credenciales inválidas. Por favor intente nuevamente.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2rem', 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)',
        boxShadow: 'none' /* No shadows allowed per rules */
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Nova Salud" style={{ width: '80px', height: '80px', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>NOVA SALUD</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Acceso Autorizado
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '600' }}>IDENTIFICADOR / EMAIL</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '600' }}>CLAVE DE ACCESO</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>
            INGRESAR AL SISTEMA
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} Nova Salud POS. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;
