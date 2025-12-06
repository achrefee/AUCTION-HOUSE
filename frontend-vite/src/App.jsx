import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import MyPosts from "./pages/MyPosts";
import MyBids from "./pages/MyBids";
import Account from "./pages/Account";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

