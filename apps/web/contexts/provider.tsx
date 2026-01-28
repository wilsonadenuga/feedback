"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "./react-query";
import { ThemeProvider } from "./theme";
import { AuthProvider } from "./auth";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
