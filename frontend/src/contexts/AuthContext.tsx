import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../generated/graphql";
import type { User } from "../generated/graphql";
import { AuthContext } from "./AuthContextType";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useMeQuery({
    skip: !localStorage.getItem("token"),
  });

  // Update user when data changes or handle error
  if (meData?.me && user?.id !== meData.me.id) {
    setUser(meData.me);
  } else if (meError) {
    localStorage.removeItem("token");
  }

  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [registerMutation, { loading: registerLoading }] =
    useRegisterMutation();

  const login = async (username: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { username, password },
        },
      });

      if (data?.login) {
        localStorage.setItem("token", data.login.accessToken);
        setUser(data.login.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error instanceof Error ? error : new Error("Login failed");
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: { username, password },
        },
      });

      if (data?.register) {
        localStorage.setItem("token", data.register.accessToken);
        setUser(data.register.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error instanceof Error ? error : new Error("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: meLoading || loginLoading || registerLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
