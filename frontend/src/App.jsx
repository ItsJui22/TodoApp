import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";

export default function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} />}
      />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route path="/verify" element={<VerifyOtp />} />
    </Routes>
  );
}
