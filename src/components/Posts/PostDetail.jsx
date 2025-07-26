import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById } from '../../redux/post/postSlice.js';
import '../../assets/styles/PostDetail.scss';
import AddComment from '../Comments/AddComment.jsx';

const PostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostById(postId));
  }, [dispatch, postId]);

  const { currentPost, loading, error } = useSelector(state => state.posts);

  if (loading) return <p>Cargando post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentPost) return <p>No se encontró el post.</p>;

return (
  <div className="post-detail">
    <h2>{currentPost.title}</h2>
    <p>{currentPost.content}</p>

    {currentPost.comments && currentPost.comments.length > 0 && (
      <div className="comments-section">
        <h3>Comentarios</h3>
        <ul>
          {currentPost.comments.map(comment => (
            <li key={comment._id}>
              <b>{comment.author?.username || 'Anónimo'}:</b> {comment.text}
            </li>
          ))}
        </ul>
      </div>
    )}
    <AddComment postId={postId} />
  </div>
);
};

export default PostDetail;
