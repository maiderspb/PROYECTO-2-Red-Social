import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../assets/styles/Header.scss';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className="header">
      <nav className="nav-container">
        <img src={logo} alt="Rediam Network Logo" className="logo" />

        <ul className="nav-list">
          <li><Link to="/home">🏠 Home</Link></li>
          <li><Link to="/login">🔐 Login</Link></li>
          <li>
              <button onClick={toggleDarkMode} className="mode-toggle-btn">
                {darkMode ? '🌞 Claro' : '🌙 Oscuro'}
              </button>
            </li>
        </ul>

        <button className="hamburger-btn" onClick={toggleMenu}>
          ☰
        </button>

        {menuOpen && (
          <ul className="dropdown-menu">
            <li><Link to="/register">📝 Register</Link></li>
            <li><Link to="/posts">📰 Todos los Posts</Link></li>
            <li><Link to="/add-post">➕ Agregar Post</Link></li>
            <li><Link to="/profile">👤 Mi Perfil</Link></li>
            
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;

