import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("customerAccessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
