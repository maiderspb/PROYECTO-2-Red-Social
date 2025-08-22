import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/auth/slices/authSlice";
import { fetchPosts } from '../../redux/post/thunks';
import { fetchComments } from "../../redux/comment";
import { fetchUserFollowers } from "../../redux/user/thunks.js";
import "../../assets/styles/Profile.scss";

import ProfileInfo from "./ProfileInfo";
import ProfileForm from "./ProfileForm";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import UserSearch from "./UserSearch";
import UserPosts from "./UserPosts";
import UserComments from "./UserComments";
import LikedPosts from "./LikedPosts";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPosts());
      dispatch(fetchComments());
      dispatch(fetchUserFollowers(user._id));
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <ProfileInfo user={user} />
      <ProfileForm user={user} />
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>

      <FollowersList user={user} />
      <FollowingList user={user} />
      <UserSearch user={user} />

      <UserPosts user={user} />
      <UserComments user={user} />
      <LikedPosts user={user} />
    </div>
  );
};

export default Profile;