const ProfileInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="user-info">
      <h4>Usuario: {user.username}</h4>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfileInfo;
