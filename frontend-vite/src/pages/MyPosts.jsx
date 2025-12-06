import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/posts/mine", { withCredentials: true })
      .then((res) => setMyPosts(res.data))
      .catch(() => navigate("/login"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:9090/api/posts/${id}`, {
        withCredentials: true,
      });
      setMyPosts(myPosts.filter((p) => p.id !== id));
      setMessage("Post deleted successfully.");
    } catch {
      setMessage("Failed to delete the post.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Posts</h1>

      {message && <p className="text-center text-yellow-400 mb-4">{message}</p>}

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {myPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-lg"
          >
            {post.imageUrl && (
              <img
                src={`http://localhost:9090${post.imageUrl}`}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-300 mb-1">{post.description}</p>
              <p className="text-sm text-blue-400">
                Starting: ${post.startingPrice}
              </p>
              <p className="text-sm text-green-400 mb-2">
                Highest: ${post.highestBid}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Ends: {new Date(post.deadline).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-xl"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
