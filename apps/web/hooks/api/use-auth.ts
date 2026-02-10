"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RegisterInput,
  RegisterResponse,
  Login,
  LoginVerify,
  ConfirmEmailInput,
  ConfirmEmailResponse,
  ResendVerificationResponse,
  ResendLoginCodeResponse,
  SuccessResponse,
} from "@feedback/schema";
import { authService } from "@/services/auth.service";
import { setTokens, clearTokens } from "@/lib/tokens";
import { toast } from "sonner";

export const useRegister = () => {
  return useMutation<SuccessResponse<RegisterResponse>, Error, RegisterInput>({
    mutationFn: (data) => authService.register(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useConfirmEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponse<ConfirmEmailResponse>,
    Error,
    ConfirmEmailInput
  >({
    mutationFn: (data) => authService.confirmEmail(data),
    onSuccess: (data) => {
      toast.success(data.message);
      setTokens(data.data.tokens);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLogin = () => {
  return useMutation<SuccessResponse<RegisterResponse>, Error, Login>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLoginVerify = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<ConfirmEmailResponse>, Error, LoginVerify>(
    {
      mutationFn: (data) => authService.loginVerify(data),
      onSuccess: (data) => {
        toast.success(data.message);
        setTokens(data.data.tokens);
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};

export const useResendVerification = () => {
  return useMutation<
    SuccessResponse<ResendVerificationResponse>,
    Error,
    string
  >({
    mutationFn: (email) => authService.resendVerification(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useResendLoginCode = () => {
  return useMutation<SuccessResponse<ResendLoginCodeResponse>, Error, string>({
    mutationFn: (email) => authService.resendLoginCode(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      clearTokens();
    },
    onSuccess: () => {
      queryClient.setQueryData(["user", "me"], null);
      toast.success("Logged out successfully");
      window.location.href = "/";
    },
  });
};
