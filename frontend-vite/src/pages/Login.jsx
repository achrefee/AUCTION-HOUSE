import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:9090/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-black px-4">
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
          error ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <label className="relative block">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <AiOutlineMail />
            </span>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="relative block">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <AiOutlineLock />
            </span>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className={`w-full py-3 mt-2 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2`}
            disabled={loading}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin" /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
