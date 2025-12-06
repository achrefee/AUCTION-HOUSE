import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white px-6 py-4 shadow-lg border-b border-white/10 backdrop-blur-md z-50 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link
            to="/home"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            BidEk
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-6 items-center font-medium">
            <Link to="/home" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/create" className="hover:text-blue-400 transition">Create</Link>
            <Link to="/my-posts" className="hover:text-blue-400 transition">My Posts</Link>
            <Link to="/my-bids" className="hover:text-blue-400 transition">My Bids</Link>
            <Link to="/account" className="hover:text-blue-400 transition">Account</Link>

            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white hover:text-blue-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar from the right */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#1e293b]/80 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-xl border-l border-white/10 backdrop-blur-xl`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-4 px-6 py-6 font-medium text-white">
              <Link to="/home" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Home</Link>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Create</Link>
              <Link to="/my-posts" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">My Posts</Link>
              <Link to="/my-bids" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">My Bids</Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Account</Link>
            </nav>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
