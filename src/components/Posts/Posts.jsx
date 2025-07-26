import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/post/postSlice.js';
import PostCard from './PostCard.jsx';

const Posts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.all);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="posts-container">
      <h2>Publicaciones</h2>
      {posts && posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p>No hay publicaciones disponibles.</p>
      )}
    </div>
  );
};

export default Posts;
