import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <Login
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSignup={() => alert("Signup next step")}
    />
  );
}
