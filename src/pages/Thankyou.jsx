import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function ThankYou() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const res = await axios.get("https://nxt-backend.onrender.com/api/profile", {
          headers: { token },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteAccount = async () => {

    setLoading(true);
    setMessage("Deleting account...");

    try {
      await axios.delete("https://nxt-backend.onrender.com/api/profile", { headers: { token: localStorage.getItem("token") } });
      setMessage("Account deleted successfully. Logging out...");
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <motion.div
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center border border-gray-700 backdrop-blur-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold text-purple-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉 Welcome, {user?.name}!
        </motion.h2>

        <p className="text-gray-400 mt-2">Your account details:</p>

        {user && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg text-left text-sm space-y-2 border border-gray-600">
            <p><span className="font-semibold text-purple-400">📧 Email:</span> {user.email}</p>
            <p><span className="font-semibold text-purple-400">🏢 Company:</span> {user.companyName}</p>
            <p><span className="font-semibold text-purple-400">🎂 Age:</span> {user.age}</p>
            <p><span className="font-semibold text-purple-400">📅 DOB:</span> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
        )}

        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg text-lg font-semibold"
            disabled={loading}
          >
            🚪 Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-lg text-lg font-semibold"
            disabled={loading}
          >
            ❌ Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
