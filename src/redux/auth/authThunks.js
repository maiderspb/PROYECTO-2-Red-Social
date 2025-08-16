import axios from 'axios';

export const updateProfile = ({ username, email, profilePicture }) => async (dispatch) => {
  try {
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.put('http://localhost:5000/api/users/profile', {
      username,
      email,
      profilePicture,
    }, {
      headers: {
        Authorization: token,
      },
    });

    dispatch({ type: 'auth/updateUser', payload: res.data });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
  }
};

