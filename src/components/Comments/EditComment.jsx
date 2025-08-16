import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../assets/styles/EditComment.scss';

const EditComment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const editingComment = JSON.parse(localStorage.getItem("editingComment"));
  if (editingComment && editingComment._id === id) {
    setText(editingComment.text);
    setLoading(false);
  } else {
    alert("Comentario no encontrado para editar");
    navigate("/profile");
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
if (!res.ok) {
  const errorText = await res.text();
  console.log("Respuesta del servidor:", errorText);
  throw new Error("Error al actualizar comentario");
}

      alert("Comentario actualizado");
      localStorage.removeItem("editingComment");
      navigate("/profile");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p>Cargando comentario...</p>;

  return (
     <div className="edit-comment-container">
      <h2>Editar Comentario</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => {
    console.log("Nuevo texto:", e.target.value);
    setText(e.target.value);
  }}
          rows={4}
          required
        />
        <button type="submit">Actualizar Comentario</button>
      </form>
    </div>
  );
};

export default EditComment;
