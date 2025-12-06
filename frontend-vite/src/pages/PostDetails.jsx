import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:9090/api/posts/${id}`, { withCredentials: true })
      .then((res) => setPost(res.data))
      .catch((err) => {
        console.error("Post not found or unauthorized");
        navigate("/home");
      });
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        `http://localhost:9090/api/posts/${id}/bid`,
        { amount: parseFloat(bid) },
        { withCredentials: true }
      );
      setMessage("Bid placed successfully!");
      setBid("");
      // Reload updated post
      const res = await axios.get(`http://localhost:9090/api/posts/${id}`, {
        withCredentials: true,
      });
      setPost(res.data);
    } catch (err) {
      setMessage("Bid failed. Amount must be higher than the current bid.");
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/10 p-6 rounded-xl shadow-xl">
        {post.imageUrl && (
          <img
            src={`http://localhost:9090${post.imageUrl}`}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-300 mb-4">{post.description}</p>
        <p>
          Starting Price:{" "}
          <span className="text-blue-400 font-semibold">${post.startingPrice}</span>
        </p>
        <p>
          Highest Bid:{" "}
          <span className="text-green-400 font-semibold">${post.highestBid}</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Deadline: {new Date(post.deadline).toLocaleString()}
        </p>

        <form onSubmit={handleBid} className="mt-6">
          <input
            type="number"
            min={post.highestBid + 1}
            step="0.01"
            placeholder="Your bid..."
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-xl w-full mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-xl text-white font-semibold"
          >
            Place Bid
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-yellow-300">{message}</p>
        )}
      </div>
    </div>
  );
}
