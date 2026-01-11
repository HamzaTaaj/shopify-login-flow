import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("customerAccessToken");

  const logout = () => {
    localStorage.removeItem("customerAccessToken");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-purple-600">
          Pizza Anytime
        </Link>

        {/* MENU */}
        <nav className="flex items-center gap-6 text-sm">
          {!token && (
            <>
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-gray-700 hover:text-purple-600"
              >
                Create Account
              </Link>

              <Link
                to="/register"
                className="text-gray-700 hover:text-purple-600"
              >
                Request Access
              </Link>
            </>
          )}

          {token && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-purple-600"
              >
                Dashboard
              </Link>

              <button onClick={logout} className="text-red-600 hover:underline">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
