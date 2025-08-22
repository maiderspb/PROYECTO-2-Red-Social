import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserFollowers, unfollowUserAsync } from "../../redux/user/thunks.js";

const FollowingList = ({ user }) => {
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFollowers(user._id)).then(({ payload }) => {
        setFollowing(payload.following || []);
      });
    }
  }, [user, dispatch]);

  const handleUnfollow = async (targetUserId) => {
    await dispatch(unfollowUserAsync(targetUserId));
    const { payload } = await dispatch(fetchUserFollowers(user._id));
    setFollowing(payload.following || []);
  };

  return (
    <div className="following-section">
      <h3>Siguiendo ({following.length})</h3>
      <ul>
        {following.map((u) => (
          <li key={u._id}>
            {u.username}
            <button onClick={() => handleUnfollow(u._id)}>Dejar de seguir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowingList;
