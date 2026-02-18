import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
  
    console.log("Sending data:", form); // 👈 দেখো কি পাঠাচ্ছে
  
    try {
      const res = await api.post("/auth/register", form);
      console.log("SUCCESS:", res.data);
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      console.log("ERROR FULL:", err); // 👈 পুরো error দেখাবে
      console.log("ERROR DATA:", err.response?.data); // 👈 backend message
  
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-600 to-blue-500">
      
      <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 text-white border border-white/30">
        
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account 
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
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline font-semibold hover:text-gray-200"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
