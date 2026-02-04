import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [token] = useLocalStorage("token", null);

  if (!loading && (!token || !user)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
