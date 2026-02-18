import { useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const verify = async () => {
    if (!otp) return setError("OTP cannot be empty");
    if (!email) return setError("Email missing. Please register again.");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      console.log("OTP verified:", res.data);
      alert("Registration Complete!");
      navigate("/login"); // success → go to login
    } catch (err) {
      console.log("OTP verify error:", err.response?.data);
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl mb-4 text-center font-bold">Verify OTP</h2>

        {error && (
          <p className="bg-red-200 text-red-800 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <input
          placeholder="Enter OTP"
          className="w-full border p-2 mb-3 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={verify}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
