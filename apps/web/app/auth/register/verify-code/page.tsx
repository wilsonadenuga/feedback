"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConfirmEmail, useResendVerification } from "@/hooks/api/use-auth";
import { VerifyCodeInput } from "../../_components/verify-code-input";
import { Button } from "@feedback/ui/components/button";
import Link from "next/link";

export default function VerifyCodePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const confirmEmailMutation = useConfirmEmail();
  const resendMutation = useResendVerification();

  useEffect(() => {
    if (!email) {
      router.replace("/auth/register");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  const handleSubmit = (code: string) => {
    confirmEmailMutation.mutate(
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
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground truncate inline-block max-w-50 align-bottom">
            {email}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Please check your spam folder if you don&apos;t see it.
        </p>
      </div>

      <VerifyCodeInput
        isSubmitting={confirmEmailMutation.isPending}
        onSubmit={handleSubmit}
      />

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
          href="/auth/register"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to registration
        </Link>
      </div>
    </div>
  );
}
