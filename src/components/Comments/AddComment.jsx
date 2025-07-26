import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../../redux/post/postSlice.js';
import '../../assets/styles/AddComment.scss';;
import { useNavigate } from 'react-router-dom';

const AddComment = ({ postId }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (text.trim()) {
    try {
      await dispatch(addComment({ postId, text })).unwrap();
      setText('');
      navigate('/posts');
    } catch (error) {
      alert('Error al añadir comentario: ' + error);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un comentario..."
        required
      />
      <button type="submit">Enviar comentario</button>
    </form>
  );
};

export default AddComment;
