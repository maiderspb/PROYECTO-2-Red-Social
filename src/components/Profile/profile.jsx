import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";

import { logout, updateUserAsync } from "../../redux/auth/authSlice";
import { fetchPosts, fetchLikedPostsByUser } from "../../redux/post/postSlice";
import {
  fetchUserFollowers,
  followUserAsync,
  unfollowUserAsync,
  searchUsersAsync,
} from "../../redux/user/userSlice";
import { fetchComments } from "../../redux/comment/commentsSlice";

import { deleteComment } from "../../redux/comment/commentsSlice";

import "../../assets/styles/Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all: posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const { all: comments } = useSelector((state) => state.comments);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [password, setPassword] = useState("");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const likedPostIds = useSelector((state) => state.posts.likedPosts || []); 
  const likedPostsData = useSelector((state) => state.posts.likedPosts);

  const profileImageUrl = React.useMemo(() => {
    if (profilePicturePreview) return profilePicturePreview;
    if (user?.image)
      return `http://localhost:5000/uploads/${user.image}?t=${
        user.imageUpdatedAt || ""
      }`;
    return "/images/default-profile.jpg";
  }, [profilePicturePreview, user?.image, user?.imageUpdatedAt]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setProfilePicturePreview(user.profilePicture || user.image || "");
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchComments());
  }, [dispatch]);

  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserFollowers(user._id)).then(({ payload }) => {
        setFollowers(payload.followers || []);
        setFollowing(payload.following || []);
      });
    }
  }, [user, dispatch]);


useEffect(() => { if (!user?._id) return; 
dispatch(fetchLikedPostsByUser(user._id)); }, [user?._id, dispatch]);

  

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const { payload } = await dispatch(searchUsersAsync(searchTerm));
      setSearchResults(Array.isArray(payload) ? payload : []);
    } catch (error) {
      alert("Error buscando usuarios: " + error.message);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFollow = async (targetUserId) => {
    console.log("→ Click en seguir", targetUserId);

    try {
      const response = await dispatch(followUserAsync(targetUserId));
      console.log("✅ Respuesta de followUserAsync:", response);

      const { payload } = await dispatch(fetchUserFollowers(user._id));
      setFollowers(payload.followers || []);
      setFollowing(payload.following || []);
    } catch (error) {
      console.error("❌ Error en handleFollow:", error);
      let errorMsg = error?.message || "Error desconocido";
      alert(`No se pudo seguir al usuario: ${errorMsg}`);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await dispatch(unfollowUserAsync(targetUserId));
      const { payload } = await dispatch(fetchUserFollowers(user._id));
      setFollowers(payload.followers || []);
      setFollowing(payload.following || []);
    } catch (error) {
      alert("Error al dejar de seguir: " + (error?.message || "Desconocido"));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("Usuario no autenticado");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePictureFile) formData.append("image", profilePictureFile);
    if (password) formData.append("password", password);

    dispatch(updateUserAsync({ userId: user._id, formData }))
      .unwrap()
      .then((updatedUser) => {
        console.log("Usuario actualizado:", updatedUser);
        alert("Perfil actualizado");
        setPassword("");
        setProfilePictureFile(null);

       
        if (updatedUser.image) {
          setProfilePicturePreview(
            `http://localhost:5000/uploads/${updatedUser.image}?t=${Date.now()}`
          );
        }
      })

      .catch((error) => {
        console.error("Error backend updateUserAsync:", error);
        alert(
          "Error actualizando perfil: " +
            (error.message || JSON.stringify(error))
        );
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al eliminar post");
      }

      alert("Post eliminado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };
  const handleEditPost = (post) => {
    localStorage.setItem("editingPost", JSON.stringify(post));
    navigate(`/edit-post/${post._id}`);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al eliminar comentario");
      }
      setUserComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );

      alert("Comentario eliminado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };
  const handleEditComment = (comment) => {
    localStorage.setItem("editingComment", JSON.stringify(comment));
    navigate(`/edit-comment/${comment._id}`);
  };

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleUnlikePost = (postId) => {
   
    dispatch(unlikePostAsync(postId)).then(() => {
      dispatch(fetchLikedPostsByUser(user._id));
    });
  };

  const handleLike = (postId, commentId) => {
    dispatch(likeComment({ postId, commentId })).then(() => {
      dispatch(fetchLikedPostsByUser(user._id));
    });
  };
  const userPosts = user
    ? posts.filter((post) => post.user?._id === user._id)
    : [];
  const userComments =
    user && Array.isArray(comments)
      ? comments.filter((comment) => {
          if (!comment.user) return false;
          const commentUserId =
            typeof comment.user === "string" ? comment.user : comment.user._id;
          return commentUserId === user._id;
        })
      : [];

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <div className="user-info">
        <h4>Usuario: {username}</h4>
        <p>Email: {email}</p>
      </div>

 
      <div className="followers-section">
        <h3>Seguidores ({followers.length})</h3>
        <ul>
          {followers.map((follower) => (
            <li key={follower._id}>
              {follower.username}
              {!following.find((f) => f._id === follower._id) &&
                follower._id !== user._id && (
                  <button onClick={() => handleFollow(follower._id)}>
                    Seguir
                  </button>
                )}
            </li>
          ))}
        </ul>
      </div>

     
      <div className="following-section">
        <h3>Siguiendo ({following.length})</h3>
        <ul>
          {following.map((userFollowed) => (
            <li key={userFollowed._id}>
              {userFollowed.username}
              <button onClick={() => handleUnfollow(userFollowed._id)}>
                Dejar de seguir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="user-search-section">
        <h3>Buscar Usuarios</h3>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {searchResults
            .filter((u) => u._id && u.username)
            .map((u) => (
              <li key={u._id}>
                {u.username}
                {following.some((f) => f._id === u._id) ? (
                  <button onClick={() => handleUnfollow(u._id)}>
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      console.log("→ Click en seguir", u._id);
                      handleFollow(u._id);
                    }}
                  >
                    Seguir
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div className="profile-card">
        <img
          src={profileImageUrl}
          alt="Foto de perfil"
          className="profile-image"
        />
        <form onSubmit={handleUpdate} className="profile-form">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Foto de perfil:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Opcional"
          />

          <button type="submit">Actualizar Perfil</button>
        </form>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

  
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

  
      <div className="user-comments">
        <h2>Mis Comentarios</h2>
        {userComments.length > 0 ? (
          <ul>
            {userComments.map((comment) => (
              <li key={comment._id}>
                <p>{comment.text}</p>
            
                {(() => {
                  const commentUserId =
                    typeof comment.user === "string"
                      ? comment.user
                      : comment.user?._id;
                  return commentUserId === user._id ? (
                    <>
                      <button onClick={() => handleEditComment(comment)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        Eliminar
                      </button>
                    </>
                  ) : null;
                })()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No has realizado comentarios aún.</p>
        )}
      </div>

   
      <div className="liked-posts">
        <h2>Publicaciones que me gustaron</h2>
        {likedPostsData.length > 0 ? (
          <ul>
            {likedPostsData.map((post) => (
              <li key={post._id}>
                <h4>{post.title}</h4>
                <p>{post.content.slice(0, 1000)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No has dado like a ninguna publicación aún.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

