import '../../assets/styles/Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Rediam Social Network. Todos los derechos reservados.</p>

        <div className="footer-links">
          <a href="/home">Inicio</a>
          <a href="/login">Login</a>
          <a href="/register">Registro</a>
        </div>

        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
            <i className="fab fa-x-twitter"></i>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <i className="fab fa-pinterest-p"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



