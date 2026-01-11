import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  if (!token) {
    return (
      <p className="text-center mt-20 text-red-600">
        Invalid or expired reset link
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await shopifyResetPassword(token, password);
      setSuccess(true);

      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Password reset failed");
    }
  };

  if (success) {
    return (
      <p className="text-center mt-20 text-green-600">
        Password updated successfully. Redirecting to login…
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        {error && (
          <div className="mb-3 text-red-600 bg-red-50 p-2 rounded">{error}</div>
        )}

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-3 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-3 rounded mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="w-full bg-purple-600 text-white py-3 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
