import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function formatCountdown(targetTime) {
  const diff = targetTime - new Date().getTime();
  if (diff <= 0) return "Auction ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}m ${String(seconds).padStart(2, "0")}s`;
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/posts", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch(() => {
        console.error("Not authenticated or error loading posts");
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e10] via-[#1f1f25] to-[#121216] text-white px-4 sm:px-10 py-12">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg mb-10">
        Explore Live Auctions
      </h1>

      {/* 🔍 Barre de recherche */}
      <div className="mb-12 flex justify-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-xl text-white bg-white/10 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPosts.map((post) => {
          const deadlineTime = new Date(post.deadline).getTime();
          const countdown = formatCountdown(deadlineTime);
          const isExpired = countdown === "Auction ended";

          return (
            <div
              key={post.id}
              className={`group relative rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 ${
                isExpired ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              } bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-xl border border-white/10`}
            >
              {post.imageUrl && (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={`http://localhost:9090${post.imageUrl}`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>
              )}

              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-blue-300 truncate">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-col text-sm text-gray-400 mt-3 space-y-1">
                  <span>
                    Start:{" "}
                    <span className="text-white font-medium">
                      ${post.startingPrice}
                    </span>
                  </span>
                  <span>
                    Highest bid:{" "}
                    <span className="text-green-400 font-semibold">
                      ${post.highestBid}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isExpired ? "text-red-500" : "text-yellow-400"
                    }`}
                  >
                    {countdown}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isExpired) navigate(`/post/${post.id}`);
                  }}
                  className={`mt-4 group/button flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                    isExpired
                      ? "bg-gray-600 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:shadow-blue-800"
                  }`}
                  disabled={isExpired}
                >
                  View Details
                  {!isExpired && (
                    <FaArrowRight className="group-hover/button:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
