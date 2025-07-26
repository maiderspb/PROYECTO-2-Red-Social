import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { logout, updateUserAsync } from "../../redux/auth/authSlice";
import { fetchPosts } from "../../redux/post/postSlice";
import "../../assets/styles/Profile.scss";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { all: posts } = useSelector((state) => state.posts);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setProfilePicturePreview(user.profilePicture || user.image || "");
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    }
    if (password) {
      formData.append("password", password);
    }

    dispatch(updateUserAsync(formData))
      .unwrap()
      .then(() => {
        alert("Perfil actualizado con éxito");
        setPassword("");
        setProfilePictureFile(null);
      })
      .catch((error) => alert("Error actualizando perfil: " + error));
  };

  const handleLogout = () => {
      console.log("Logout clicked");
    dispatch(logout());
     navigate("/");
  };

 const userPosts = user && posts.length > 0
  ? posts.filter(
      (post) =>
        post.author &&
        post.author._id?.toString() === user._id?.toString()
    )
  : [];
  console.log("Usuario desde Redux:", user);
  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <div className="user-info">
        <h4>Usuario: {username}</h4>
        <p>Email: {email}</p>
      </div>

      <div className="profile-card">
        <img
          src={profilePicturePreview || "https://via.placeholder.com/150"}
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
              </li>
            ))}
          </ul>
        ) : (
          <p>No has publicado nada aún.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

