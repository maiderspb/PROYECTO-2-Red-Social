import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/auth/authSlice";
import "../../assets/styles/Login.scss";
import { notification } from "antd";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(login(formData)).unwrap();
      navigate("/add-post");

    } catch (err) {
      notification.error({
        message: "Error de inicio de sesión",
        description: err.message || "Credenciales inválidas",
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={onChange}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
