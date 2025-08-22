import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { updateUserAsync } from "../../redux/auth/slices/authSlice";

const ProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
 const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.image ? `http://localhost:5000/uploads/${user.image}?t=${user.imageUpdatedAt || ""}` : ""
  );


  const profileImageUrl = useMemo(() => {
    if (profilePicturePreview) return profilePicturePreview;
    return "/images/default-profile.jpg";
  }, [profilePicturePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!user?._id) {
      alert("Usuario no autenticado");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    if (profilePictureFile) formData.append("image", profilePictureFile);
    if (password) formData.append("password", password);

    dispatch(updateUserAsync({ userId: user._id, formData }))
      .unwrap()
      .then((updatedUser) => {
        alert("Perfil actualizado");
        setPassword("");
        setProfilePictureFile(null);

        if (updatedUser.image) {
          setProfilePicturePreview(
            `http://localhost:5000/uploads/${updatedUser.image}?t=${Date.now()}`
          );
           }
      })
      .catch((err) => {
        alert("Error actualizando perfil: " + (err.message || JSON.stringify(err)));
      });
  };

  return (
    <div className="profile-card">
      <img src={profileImageUrl} alt="Foto de perfil" className="profile-image" />

      <form onSubmit={handleUpdate} className="profile-form">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

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
    </div>
  );
};

export default ProfileForm;