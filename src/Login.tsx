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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-purple-200 p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {mode === "login" && "Sign In"}
            {mode === "forgot" && "Forgot Password"}
          </h1>

          <p className="text-sm text-slate-600">
            {mode === "login" && "Welcome back! Please sign in to continue."}
            {mode === "forgot" && "Enter your email to receive a reset link."}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
            {success}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              required
            />

            <button
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ================= FOOTER LINKS ================= */}
        <div className="text-center text-sm text-slate-600 mt-6 space-y-2">
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
