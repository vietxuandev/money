import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  let token = null;
  try {
    const tokenItem = localStorage.getItem("token");
    token = tokenItem ? JSON.parse(tokenItem) : null;
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
