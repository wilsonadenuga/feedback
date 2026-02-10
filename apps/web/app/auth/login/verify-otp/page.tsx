"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoginVerify, useResendLoginCode } from "@/hooks/api/use-auth";
import { VerifyCodeInput } from "../../_components/verify-code-input";
import { Button } from "@feedback/ui/components/button";
import Link from "next/link";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const loginVerifyMutation = useLoginVerify();
  const resendMutation = useResendLoginCode();

  useEffect(() => {
    if (!email) {
      router.replace("/auth/login");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  const handleSubmit = (code: string) => {
    loginVerifyMutation.mutate(
      { email, code },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  const handleResend = () => {
    resendMutation.mutateAsync(email);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Enter your code</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit login code to{" "}
          <span className="font-medium text-foreground truncate inline-block max-w-50 align-bottom">
            {email}
          </span>
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span className="text-lg">🔒</span>
          Don&apos;t share this code with anyone
        </p>
      </div>

      <VerifyCodeInput onSubmit={handleSubmit} />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="text-sm h-auto p-0"
        >
          {resendMutation.isPending ? "Sending..." : "Resend code"}
        </Button>
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
