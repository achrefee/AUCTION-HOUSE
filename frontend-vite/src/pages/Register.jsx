import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:9090/api/auth/register", {
        email,
        password,
        fullName,
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={handleRegister}
        className={`w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
          error ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin" /> Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
