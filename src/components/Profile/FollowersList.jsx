import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserFollowers, followUserAsync, unfollowUserAsync } from "../../redux/user/thunks.js";

const FollowersList = ({ user }) => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFollowers(user._id)).then(({ payload }) => {
        setFollowers(payload.followers || []);
        setFollowing(payload.following || []);
      });
    }
  }, [user, dispatch]);

  const handleFollow = async (targetUserId) => {
    await dispatch(followUserAsync(targetUserId));
    const { payload } = await dispatch(fetchUserFollowers(user._id));
    setFollowers(payload.followers || []);
    setFollowing(payload.following || []);
  };

  const handleUnfollow = async (targetUserId) => {
    await dispatch(unfollowUserAsync(targetUserId));
    const { payload } = await dispatch(fetchUserFollowers(user._id));
    setFollowers(payload.followers || []);
    setFollowing(payload.following || []);
  };

  return (
    <div className="followers-section">
      <h3>Seguidores ({followers.length})</h3>
      <ul>
        {followers.map((follower) => (
          <li key={follower._id}>
            {follower.username}
            {!following.find((f) => f._id === follower._id) &&
              follower._id !== user._id && (
                <button onClick={() => handleFollow(follower._id)}>Seguir</button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersList;