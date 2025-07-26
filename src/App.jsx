import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Login from './components/Login/Login.jsx';
import CreatePost from './components/Posts/AddPost.jsx';
import Register from './components/Register/Register.jsx';
import Home from './components/Home/Home.jsx';
import Footer from './components/Footer/Footer.jsx';
import Posts from './components/Posts/Posts.jsx';
import AddPost from './components/Posts/AddPost.jsx';
import PostDetail from './components/Posts/PostDetail.jsx';
import Profile from './components/Profile/profile.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}, [darkMode]);

  return (
    <div className="App">
      <BrowserRouter>
       <Header
  darkMode={darkMode}
  toggleDarkMode={() => setDarkMode(prev => !prev)}
/>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<AddPost />} />
          <Route path="/home" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
           <Route path="/add-post" element={<AddPost />} />
          <Route path="/post-detail/:postId" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
           <Footer />

    </div>
  );
}

export default App;

