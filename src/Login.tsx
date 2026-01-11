import { useState } from "react";

export default function Login({
  onLoginSuccess,
  onSignup,
}: {
  onLoginSuccess: () => void;
  onSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // very simple demo auth
    if (email === "test@test.com" && password === "123456") {
      onLoginSuccess();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-purple-600 p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 text-white text-xl">
            →
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Welcome back! Sign in to access your account.
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email *
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-purple-600 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-800">
                Password *
              </label>
              <button
                type="button"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-purple-600 outline-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition"
          >
            → Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSignup}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
