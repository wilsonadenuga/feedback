import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { env } from "./env";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const COOKIE_OPTIONS = {
  path: "/",
  secure: env.environment === "production",
  sameSite: "strict" as const,
};

export function setTokens(tokens: Tokens): void {
  setCookie("accessToken", tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: tokens.expiresIn,
  });
  setCookie("refreshToken", tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearTokens(): void {
  deleteCookie("accessToken", { path: "/" });
  deleteCookie("refreshToken", { path: "/" });
}

export function getAccessToken(): string | null {
  const token = getCookie("accessToken");
  return token ? String(token) : null;
}

export function getRefreshToken(): string | null {
  const token = getCookie("refreshToken");
  return token ? String(token) : null;
}
