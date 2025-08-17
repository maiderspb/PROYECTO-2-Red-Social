import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/Home.scss";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenid@ a Rediam Social Network</h1>
      <p>
        Impulsa tu carrera conectando con profesionales, comparte tus logros y
        descubre nuevas oportunidades.
      </p>
      <p>
        Crea tu perfil, construye tu red y haz que tu trayectoria cuente 💼 🚀
      </p>

      <nav className="home-nav">
        <ul>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/profile">Perfil</Link>
          </li>
          <li>
            <Link to="/register">Registro</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;

