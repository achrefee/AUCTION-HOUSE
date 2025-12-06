import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/account", { withCredentials: true })
      .then((res) => setEmail(res.data.email))
      .catch(() => {
        setError("You are not logged in.");
        navigate("/login");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">My Account</h2>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <p className="text-gray-300 text-sm mb-2">Logged in as:</p>
            <p className="text-blue-400 font-semibold">{email}</p>
          </>
        )}
      </div>
    </div>
  );
}
