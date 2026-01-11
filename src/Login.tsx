import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopifyLogin } from "./shopify";

type Mode = "login" | "forgot";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const token = await shopifyLogin(email, password);
      localStorage.setItem("customerAccessToken", token.accessToken);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-purple-600 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {mode === "login" && "Sign In"}
          {mode === "forgot" && "Forgot Password"}
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          {mode === "login" && "Welcome back! Please sign in."}
          {mode === "forgot" && "Enter your email to receive a reset link."}
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
            {success}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 border p-3 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 border p-3 rounded"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ================= FOOTER LINKS ================= */}
        <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
          {mode === "forgot" && (
            <button
              onClick={() => {
                resetMessages();
                setMode("login");
              }}
              className="text-purple-600 hover:underline block"
            >
              Back to Sign In
            </button>
          )}

          {mode === "login" && (
            <>
              <button
                onClick={() => navigate("/register")}
                className="text-purple-600 hover:underline block"
              >
                Request Access
              </button>

              <button
                onClick={() => {
                  resetMessages();
                  setMode("forgot");
                }}
                className="text-purple-600 hover:underline block"
              >
                Forgot password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
