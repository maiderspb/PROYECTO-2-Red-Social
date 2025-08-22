import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserComments = ({ user }) => {
  const navigate = useNavigate();
  const { all: comments } = useSelector((state) => state.comments);

  const userComments = comments.filter((comment) => {
    if (!comment.user) return false;
    const commentUserId = typeof comment.user === "string" ? comment.user : comment.user._id;
    return commentUserId === user?._id;
  });

  const handleEditComment = (comment) => {
    localStorage.setItem("editingComment", JSON.stringify(comment));
    navigate(`/edit-comment/${comment._id}`);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Error al eliminar comentario");
      alert("Comentario eliminado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="user-comments">
      <h2>Mis Comentarios</h2>
      {userComments.length > 0 ? (
        <ul>
          {userComments.map((c) => (
            <li key={c._id}>
              <p>{c.text}</p>
              <p>❤️ {c.likes?.length || 0} likes</p> 
              <button onClick={() => handleEditComment(c)}>Editar</button>
              <button onClick={() => handleDeleteComment(c._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No has realizado comentarios aún.</p>
      )}
    </div>
  );
};

export default UserComments;