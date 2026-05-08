import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, ShoppingCart, User as UserIcon } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useState, useEffect } from 'react';

// ICONOS ESTRICTAMENTE CUADRADOS
const SquareSun = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="9" y="9" width="6" height="6" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
  </svg>
);

const SquareMoon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M21 14 L10 14 L10 3 L3 10 L3 21 L14 21 Z" />
  </svg>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/pos', label: 'Caja (POS)', icon: ShoppingCart, roles: ['admin', 'cashier'] },
    { path: '/inventory', label: 'Inventario', icon: Package, roles: ['admin', 'cashier'] },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <img src={logo} alt="Nova Salud" style={{ width: '40px', height: '40px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>NOVA SALUD</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                  color: isActive ? 'var(--bg-primary)' : 'inherit',
                  borderLeft: isActive ? '4px solid var(--success-color)' : '4px solid transparent',
                  fontWeight: isActive ? '600' : '400'
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'var(--border-color)', padding: '0.5rem' }}>
              <UserIcon size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{user?.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2"
            style={{ backgroundColor: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="navbar">
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            {location.pathname === '/pos' ? 'Punto de Venta' : location.pathname === '/inventory' ? 'Gestión de Inventario' : ''}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme} 
              style={{ 
                backgroundColor: 'transparent', 
                color: 'var(--text-primary)', 
                width: '36px',
                height: '36px',
                padding: '0', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Cambiar Tema"
            >
              {theme === 'dark' ? <SquareSun size={18} /> : <SquareMoon size={18} />}
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
