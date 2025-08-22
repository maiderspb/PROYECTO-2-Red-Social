import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../redux/post/thunks/fetchPosts.js";
import { shallowEqual} from "react-redux";

const UserPosts = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const posts = useSelector((state) => state.posts?.posts, shallowEqual) || [];

  console.log("Usuario actual:", user);
console.log("Posts desde Redux:", posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const userPosts = posts.filter((post) => {  console.log("Post.user:", post.user);
    return (
      post.user?._id === user?._id ||
      post.user === user?._id ||
      post.user === user?.username
    );
  });
  const handleEditPost = (post) => {
    localStorage.setItem("editingPost", JSON.stringify(post));
    navigate(`/edit-post/${post._id}`);
  };

const handleDeletePost = async (postId) => {
  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al eliminar post");
    }

    alert("Post eliminado correctamente");

    dispatch(fetchPosts());
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="user-posts">
      <h2>Mis Publicaciones</h2>
      {userPosts.length > 0 ? (
        <ul>
          {userPosts.map((post) => (
            <li key={post._id}>
              <h4>{post.title}</h4>
              <p>{post.content.slice(0, 100)}...</p>
              <button onClick={() => handleEditPost(post)}>Editar</button>
              <button onClick={() => handleDeletePost(post._id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No has publicado nada aún.</p>
      )}
    </div>
  );
};

export default UserPosts;
