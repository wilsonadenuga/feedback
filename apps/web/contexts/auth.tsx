"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, SuccessResponse } from "@feedback/schema";
import { authService } from "@/services/auth.service";
import { clearTokens, getAccessToken } from "@/lib/tokens";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<SuccessResponse<User>, Error>({
    queryKey: ["user", "me"],
    queryFn: () => authService.getMe(),
    enabled: !!getAccessToken(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const logout = useCallback(() => {
    clearTokens();
    queryClient.setQueryData(["user", "me"], null);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    window.location.href = "/";
  }, [queryClient]);

  const refetchUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user", "me"] });
  }, [queryClient]);

  const value: AuthContextValue = {
    user: data?.data ?? null,
    isLoading,
    isAuthenticated: !!data?.data,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
