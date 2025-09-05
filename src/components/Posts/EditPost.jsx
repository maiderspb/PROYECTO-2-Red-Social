import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/EditPost.scss";

const EditPost = () => {
  const navigate = useNavigate();

  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
   const [image, setImage] = useState(null);

  useEffect(() => {
    const post = JSON.parse(localStorage.getItem("editingPost"));
    if (!post) {
      navigate("/profile");
      return;
    }
    setEditingPost(post);
    setTitle(post.title || "");
    setContent(post.content || "");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingPost?._id) {
      alert("No se encontró el post para editar.");
      navigate("/profile");
      return;
    }

    const formData = new FormData();
formData.append("title", title);
formData.append("content", content);
 if (image) {
      formData.append("image", image);}
try { 

      const res = await fetch(`/api/posts/${editingPost._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Respuesta de actualización:", res.status, data);

      if (!res.ok) throw new Error(data.message || "Error al actualizar post");

      alert("Post actualizado correctamente");
      localStorage.removeItem("editingPost");
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!editingPost) {
    return null;
  }

  return (
    <div className="edit-post-container">
      <h2>Editar Publicación</h2>
      <form onSubmit={handleSubmit} className="edit-post-form">
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Contenido:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          required
        />

         <label>Imagen:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />


        <button type="submit">Actualizar Post</button>
        <button type="button" onClick={() => navigate("/profile")}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditPost;
