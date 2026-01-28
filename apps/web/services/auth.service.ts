import {
  RegisterInput,
  RegisterResponse,
  Login,
  LoginVerify,
  ConfirmEmailInput,
  ConfirmEmailResponse,
  ResendVerificationResponse,
  User,
  SuccessResponse,
} from "@feedback/schema";
import { apiClient } from "@/lib/api-client";

export const authService = {
  register: (
    data: RegisterInput,
  ): Promise<SuccessResponse<RegisterResponse>> => {
    return apiClient.post("/v1/auth/register", data);
  },

  confirmEmail: (
    data: ConfirmEmailInput,
  ): Promise<SuccessResponse<ConfirmEmailResponse>> => {
    return apiClient.post("/v1/auth/confirm-email", data);
  },

  login: (data: Login): Promise<SuccessResponse<RegisterResponse>> => {
    return apiClient.post("/v1/auth/login", data);
  },

  loginVerify: (
    data: LoginVerify,
  ): Promise<SuccessResponse<ConfirmEmailResponse>> => {
    return apiClient.post("/v1/auth/login/verify", data);
  },

  resendVerification: (
    email: string,
  ): Promise<SuccessResponse<ResendVerificationResponse>> => {
    return apiClient.post("/v1/auth/resend-verification-email", { email });
  },

  getMe: (): Promise<SuccessResponse<User>> => {
    return apiClient.get("/v1/auth/me", { authenticated: true });
  },
};
