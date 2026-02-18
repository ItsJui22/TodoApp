import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
      
      <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 text-white border border-white/30">
        
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 
        </h2>

        {error && (
          <p className="bg-red-500/30 text-red-100 text-sm p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-80 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          New user?{" "}
          <Link
            to="/register"
            className="underline font-semibold hover:text-gray-200"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
