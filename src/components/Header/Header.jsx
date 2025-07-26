import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../assets/styles/Header.scss';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  const token = localStorage.getItem('token');

  {token && (
  <li><Link to="/add-post">Agregar Post</Link></li>
)}


  return (
    <header className="header">
      <nav className="nav-container">
        <ul className="nav-list">
           <img src={logo} alt="Rediam Network Logo" className="logo" />
          <li><Link to="/register">📝 Register</Link></li>
          <li><Link to="/login">🔐 Login</Link></li>
          <li><Link to="/home">🏠 Home</Link></li>
          <li className="dropdown">
            <span>📰 Posts</span>
            <ul className="dropdown-content">
              <li><Link to="/posts">Todos los Posts</Link></li>
              <li><Link to="/add-post">Agregar Post</Link></li> 
            </ul>
       </li>
          <li><Link to="/profile">👤 Mi Perfil</Link></li>
          <li>
            <button onClick={toggleDarkMode} className="mode-toggle-btn">
              {darkMode ? '🌞 Claro' : '🌙 Oscuro'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
