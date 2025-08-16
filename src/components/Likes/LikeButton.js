import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePost } from '../../redux/post/postSlice.js';

const LikeButton = ({ postId }) => {
  const dispatch = useDispatch();
  const likedPosts = useSelector(state => state.posts.likedPosts);
  const isLiked = likedPosts.includes(postId);

  const handleLike = () => {
    dispatch(toggleLikePost(postId));
  };

  return (
    <button onClick={handleLike}>
      {isLiked ? '❤️ Quitar Like' : '🤍 Dar Like'}
    </button>
  );
};

export default LikeButton;
