import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/informations', label: 'Informations' },
  { to: '/respiration',  label: 'Respiration' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-sage-500' : 'text-gray-600 hover:text-sage-500'
    }`;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">CZ</span>
            </div>
            <span className="font-semibold text-gray-800 hidden sm:block">
              CESI<span className="text-sage-500">Zen</span>
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={linkClass}>
                    Administration
                  </NavLink>
                )}
                <NavLink to="/profil" className={linkClass}>
                  {user.first_name}
                </NavLink>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/connexion"  className={linkClass}>Connexion</NavLink>
                <NavLink to="/inscription" className="btn-primary text-sm py-1.5 px-4">
                  S'inscrire
                </NavLink>
              </>
            )}
          </div>

          {/* Burger Mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-sage-50"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {navLinks.map(l => (
            <NavLink
              key={l.to} to={l.to}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium ${isActive ? 'text-sage-500' : 'text-gray-600'}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <hr className="border-gray-100" />
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" className="block py-2 text-sm text-gray-600"
                  onClick={() => setMenuOpen(false)}>Administration</NavLink>
              )}
              <NavLink to="/profil" className="block py-2 text-sm text-gray-600"
                onClick={() => setMenuOpen(false)}>Mon profil</NavLink>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-500">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion"   className="block py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Connexion</NavLink>
              <NavLink to="/inscription" className="block py-2 text-sm text-sage-500 font-medium" onClick={() => setMenuOpen(false)}>S'inscrire</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
