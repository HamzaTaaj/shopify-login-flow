// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       await shopifyForgotPassword(email);
//       // Shopify always returns success (security reason)
//       setMessage("Password reset email sent. Please check your inbox.");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white rounded-2xl border-2 border-purple-600 p-8 shadow-xl">
//         <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
//         <p className="text-sm text-gray-600 mb-4">
//           Enter your email to receive a reset link.
//         </p>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mb-4 border p-3 rounded"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-purple-600 text-white py-3 rounded disabled:opacity-50"
//           >
//             {loading ? "Sending..." : "Send Reset Email"}
//           </button>
//         </form>

//         <button
//           onClick={() => navigate("/")}
//           className="mt-4 text-sm text-purple-600"
//         >
//           Back to Sign In
//         </button>
//       </div>
//     </div>
//   );
// }
