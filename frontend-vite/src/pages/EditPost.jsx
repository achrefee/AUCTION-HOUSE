import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:9090/api/posts/${id}`, { withCredentials: true })
      .then((res) => setPost(res.data))
      .catch(() => navigate("/home"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(`http://localhost:9090/api/posts/${id}`, post, {
        withCredentials: true,
      });
      navigate("/my-posts");
    } catch {
      setError("Failed to update post.");
    }
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Post</h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="px-4 py-3 bg-white/10 text-white rounded-xl"
            required
          />

          <textarea
            placeholder="Description"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="px-4 py-3 bg-white/10 text-white rounded-xl"
            required
          />

          <input
            type="number"
            placeholder="Starting Price"
            value={post.startingPrice}
            onChange={(e) => setPost({ ...post, startingPrice: parseFloat(e.target.value) })}
            className="px-4 py-3 bg-white/10 text-white rounded-xl"
            required
          />

          <input
            type="datetime-local"
            value={post.deadline?.slice(0, 16)}
            onChange={(e) => setPost({ ...post, deadline: e.target.value })}
            className="px-4 py-3 bg-white/10 text-white rounded-xl"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
