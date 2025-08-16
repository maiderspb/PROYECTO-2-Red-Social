import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth/authSlice.js';
import { notification } from 'antd';
import '../../assets/styles/Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    age: '',
  });

  const [error, setError] = useState('');
  const [ageError, setAgeError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { firstName, username, email, password, password2, age } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    setError('');
    if (name === 'age') {
      if (parseInt(value) < 16) {
        setAgeError('No puedes usar esta red si no tienes al menos 16 años.');
      } else {
        setAgeError('');
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      return notification.error({
        message: 'Error',
        description: 'Las contraseñas no coinciden',
      });
    }

    if (!age || parseInt(age) < 16) {
      setAgeError('No puedes usar esta red si no tienes al menos 16 años.');
      return;
    }

    try {
      const result = await dispatch(register({ firstName, username, email, password, age })).unwrap();

      notification.success({
        message: 'Registro exitoso',
        description: 'Usuario creado correctamente',
      });

      navigate('/login');
    } catch (err) {
      const message = err?.message || 'Error al registrar';
      setError(message);
      notification.error({
        message: 'Error',
        description: message,
      });
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={onSubmit} className="register-form">
        <h2>Crear cuenta</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={firstName}
          onChange={onChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={username}
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={age}
          onChange={onChange}
          min="0"
          required
        />
        {ageError && <p className="error-message" aria-live="assertive">{ageError}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Repetir contraseña"
          value={password2}
          onChange={onChange}
          required
        />

        {error && <p className="error-message" aria-live="assertive">{error}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;


