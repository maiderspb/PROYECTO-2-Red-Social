import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost, fetchPosts } from  '../../redux/post/thunks';;
import '../../assets/styles/PostCard.scss';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const isAuthor = user && (user.id === post.authorId || user._id === post.authorId);

const hasLiked = user && post.likes?.some(id => String(id) === String(user._id || user.id));

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar este post?')) {
      dispatch(deletePost(post._id));
    }
  };

const handleLikeToggle = async () => {
  if (!user) return alert('Debes estar logueado para dar like.');

  try {
    const method = hasLiked ? 'DELETE' : 'POST';
    const res = await fetch(`/api/posts/${post._id}/like`, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) {
      const msg = await res.text();
      console.error('Error del servidor:', res.status, msg);
      return;
    }

    const updatedPost = await res.json();


    dispatch(fetchPosts());


  } catch (error) {
    console.error('Error al alternar like:', error.message);
  }
};



  return (
    <div className="post-card">
      <h3>{post.title}</h3>

      {post.image && (
  <img src="/uploads/Patagonia.jpg" alt="Patagonia" />
      )}

      <p>{post.content.slice(0, 150)}...</p>
      <p><em>Autor: {post.authorName || 'Desconocido'}</em></p>

      <p>Likes: {post.likes?.length || 0}</p>
      <button onClick={handleLikeToggle}>
        {hasLiked ? '👎 Quitar Like' : '👍 Dar Like'}
      </button>

      <br />
      <Link to={`/post-detail/${post._id}`}>Ver más</Link>

      {isAuthor && <button onClick={handleDelete} className="delete-button">Eliminar</button>}
    </div>
  );
};

export default PostCard;

