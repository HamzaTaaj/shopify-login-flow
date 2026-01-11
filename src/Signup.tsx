import { useState } from "react";

export default function Signup({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      alert("Account created 🎉");
      onSuccess(); // login page
    } else {
      alert("Fill all fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-purple-600 p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 bg-gray-800 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 bg-gray-800 text-white"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
