import { AuthContext } from "@/contexts/auth-context";
import {
  type User,
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/generated/graphql";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { clearApolloCache } from "@/lib/apollo-client";
import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    "token",
    null,
  );

  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useMeQuery({
    skip: !token,
  });

  // Update user when data changes or handle error
  if (meData?.me && user?.id !== meData.me.id) {
    setUser(meData.me);
  } else if (meError) {
    removeToken();
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

      if (data && data.login) {
        setToken(data.login.accessToken);
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

      if (data && data.register) {
        setToken(data.register.accessToken);
        setUser(data.register.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error instanceof Error ? error : new Error("Registration failed");
    }
  };

  const logout = () => {
    removeToken();
    clearApolloCache();
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
