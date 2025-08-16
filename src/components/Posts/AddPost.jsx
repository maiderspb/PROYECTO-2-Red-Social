import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../redux/post/postSlice.js';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/AddPost.scss';

const AddPost = () => {
  const [data, setData] = useState({ title: '', content: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log('Usuario en AddPost:', user);

  useEffect(() => {
  if (!user) {
    alert('No estás logueado. Redirigiendo...');
    navigate('/login');
  } else if (!(user.id || user._id)) {
    alert('Tu usuario no tiene ID válido. Redirigiendo...');
    navigate('/login');
  }
}, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.title.trim() || !data.content.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      if (!user || !(user.id || user._id)) {
        alert('Error: No hay usuario logueado o no tiene ID');
        return;
      }

await dispatch(addPost({
  title: data.title,
  content: data.content,
  authorId: user.id || user._id,
 authorName: user.username
 
})).unwrap();

      navigate('/posts');
    } catch (error) {
      alert('Error al publicar: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-post-form">
      <input
        name="title"
        placeholder="Título"
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />
      <textarea
        name="content"
        placeholder="Contenido"
        onChange={(e) => setData({ ...data, content: e.target.value })}
      />
      <button type="submit">Publicar</button>
    </form>
  );
};

export default AddPost;



