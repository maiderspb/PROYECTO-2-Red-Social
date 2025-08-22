import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchLikedPostsByUser } from "../../redux/post/thunks/fetchLikedPostsByUser.js";

const LikedPosts = ({ user }) => {
  const dispatch = useDispatch();
  const { likedPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchLikedPostsByUser(user._id || user.id));
    }
  }, [user, dispatch]);

  if (loading) return <p>Cargando publicaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
     <div className="liked-posts">
      <h2>Publicaciones que me gustaron</h2>
      {likedPosts.length > 0 ? (
        <ul>
          {likedPosts.map((post) => (
            <li key={post._id}>
              <h4>{post.title}</h4>
              <p>{post.content.slice(0, 150)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No has dado like a ninguna publicación aún.</p>
      )}
    </div>
  );
};

export default LikedPosts;