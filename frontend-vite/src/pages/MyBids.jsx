import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyBids() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/posts/my-bids", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch(() => navigate("/login"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Bids</h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
              <button
                onClick={() => navigate(`/post/${post.id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-xl w-full"
              >
                Continue Bidding
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
