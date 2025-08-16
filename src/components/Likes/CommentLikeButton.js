import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeComment } from '../../redux/post/postSlice';

const CommentLikeButton = ({ postId, commentId }) => {
  const dispatch = useDispatch();
  const likedComments = useSelector(state => state.posts.likedComments); 
  const isLiked = likedComments?.[commentId];

  const handleLike = () => {
    dispatch(toggleLikeComment({ postId, commentId }));
  };

  return (
    <button onClick={handleLike}>
      {isLiked ? '❤️ Quitar Like' : '🤍 Dar Like'}
    </button>
  );
};

export default CommentLikeButton;
