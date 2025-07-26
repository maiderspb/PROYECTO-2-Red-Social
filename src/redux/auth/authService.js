import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  const { user, token } = res.data;

  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', JSON.stringify(token));
  }

  return res.data;
};

const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
 console.log('LOGIN RESPONSE:', JSON.stringify(res.data, null, 2));

  const { user, token } = res.data;

  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', JSON.stringify(token));
  } else {
    console.warn('⚠️ Login no devolvió user/token completos:', res.data);
  }

  return res.data;
};

const logout = async () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return;
  try {
    const res = await axios.delete(`${API_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data) {
      localStorage.clear();
      return res.data;
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

const updateUser = async (userData) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const res = await axios.put(`${API_URL}/profile`, userData, config);
  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data));
  }
  return res.data;
};

const authService = {
  register,
  login,
  logout,
  updateUser,
};

export default authService;
