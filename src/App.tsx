import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

// import ResetPassword from "./ResetPassword";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        {/* 
        <Route path="/reset-password" element={<ResetPassword />} /> */}

        {/* default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}
