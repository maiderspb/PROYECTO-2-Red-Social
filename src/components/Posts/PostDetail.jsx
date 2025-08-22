import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById } from '../../redux/post/thunks';
import '../../assets/styles/PostDetail.scss';
import AddComment from '../Comments/AddComment.jsx';
import { likeComment } from '../../redux/post/thunks';

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

  const handleLike = (commentId) => {
  dispatch(likeComment({ postId, commentId }));
};
return (
  <div className="post-detail">
    <h2>{currentPost.title}</h2>
    <p>{currentPost.content}</p>

{currentPost.comments.map(comment => (
  <li key={comment._id}>
    <div><i><b>Autor:</b> {comment.user?.username || 'Anónimo'}</i></div>
    <div>{comment.text}</div>
    <div className="comment-actions">
  <button onClick={() => handleLike(comment._id)}>
  ❤️ Like ({comment.likes?.length ?? 0})
</button>
    </div>
  </li>
))}
    <AddComment postId={postId} />
  </div>
);
};

export default PostDetail;
