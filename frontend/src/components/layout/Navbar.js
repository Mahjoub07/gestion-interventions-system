import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/StatusBadge';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, hasRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Tableau de bord', icon: '📊' },
    { to: '/interventions', label: 'Interventions', icon: '🔧' },
  ];

  if (hasRole('ADMIN')) {
    navLinks.push({ to: '/users', label: 'Utilisateurs', icon: '👥' });
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {menuOpen && (
        <div className="sidebar__overlay" onClick={() => setMenuOpen(false)} />
      )}

      <button
        className="sidebar__mobile-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <Link to="/" className="sidebar__brand" onClick={() => setMenuOpen(false)}>
            <span className="sidebar__logo">⚙️</span>
            <span className="sidebar__title">Gestion Interventions</span>
          </Link>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`sidebar__link ${isActive(link.to) ? 'sidebar__link--active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="sidebar__link-icon">{link.icon}</span>
                  <span className="sidebar__link-label">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <button
            className="sidebar__user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="sidebar__user-avatar">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </span>
            <span className="sidebar__user-name">{user?.prenom} {user?.nom}</span>
            <span className="sidebar__user-chevron">▼</span>
          </button>

          {dropdownOpen && (
            <div className="sidebar__dropdown">
              <div className="sidebar__dropdown-header">
                <span className="sidebar__dropdown-name">{user?.prenom} {user?.nom}</span>
                <RoleBadge role={user?.role} />
              </div>
              <button className="sidebar__dropdown-item" onClick={handleLogout}>
                <span>🚪</span> Déconnexion
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
