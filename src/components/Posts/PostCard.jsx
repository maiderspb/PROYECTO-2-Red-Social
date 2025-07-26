import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost } from '../../redux/post/postSlice.js';
import '../../assets/styles/PostCard.scss';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const isAuthor = user && (user.id === post.authorId || user._id === post.authorId);

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar este post?')) {
      dispatch(deletePost(post._id));
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content.slice(0, 150)}...</p>
      <p><em>Autor: {post.authorName || 'Desconocido'}</em></p>
      <Link to={`/post-detail/${post._id}`}>Ver más</Link>
      {isAuthor && <button onClick={handleDelete} className="delete-button">Eliminar</button>}
    </div>
  );
};

export default PostCard;
