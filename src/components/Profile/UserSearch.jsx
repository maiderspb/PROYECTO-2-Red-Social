import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchUsersAsync, followUserAsync, unfollowUserAsync, fetchUserFollowers } from "../../redux/user/thunks.js";

const UserSearch = ({ user }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFollowers(user._id)).then(({ payload }) => {
        setFollowing(payload.following || []);
      });
    }
  }, [user, dispatch]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const { payload } = await dispatch(searchUsersAsync(searchTerm));
    setResults(Array.isArray(payload) ? payload : []);
  };

  useEffect(() => {
    const timeout = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleFollow = async (targetUserId) => {
    await dispatch(followUserAsync(targetUserId));
    const { payload } = await dispatch(fetchUserFollowers(user._id));
    setFollowing(payload.following || []);
  };

  const handleUnfollow = async (targetUserId) => {
    await dispatch(unfollowUserAsync(targetUserId));
    const { payload } = await dispatch(fetchUserFollowers(user._id));
    setFollowing(payload.following || []);
  };

  return (
    <div className="user-search-section">
      <h3>Buscar Usuarios</h3>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {results
          .filter((u) => u._id && u.username)
          .map((u) => (
            <li key={u._id}>
              {u.username}
              {following.some((f) => f._id === u._id) ? (
                <button onClick={() => handleUnfollow(u._id)}>Dejar de seguir</button>
              ) : (
                <button onClick={() => handleFollow(u._id)}>Seguir</button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserSearch;