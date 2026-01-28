"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, Login } from "@feedback/schema";
import {
  useLogin,
  useLoginVerify,
  useResendVerification,
} from "@/hooks/use-auth";
import { Button } from "@feedback/ui/components/button";
import { Input } from "@feedback/ui/components/input";
import { VerifyCodeDialog } from "../_components/verify-code-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const loginMutation = useLogin();
  const loginVerifyMutation = useLoginVerify();
  const resendMutation = useResendVerification();

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: Login) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        setEmail(data.email);
        setShowVerifyDialog(true);
      },
    });
  };

  const handleVerify = (code: string) => {
    loginVerifyMutation.mutate(
      { email, code },
      {
        onSuccess: () => {
          setShowVerifyDialog(false);
          router.push("/dashboard");
        },
      },
    );
  };

  const handleResend = async () => {
    await resendMutation.mutateAsync(email);
  };

  return (
    <>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a login code
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...form.register("email")}
            label="Email"
            placeholder="Enter your email"
            type="email"
            error={form.formState.errors.email}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Sending Code..." : "Send Login Code"}
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Create one
            </Link>
          </div>
        </form>
      </div>

      <VerifyCodeDialog
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
        mode="login"
        email={email}
        isSubmitting={loginVerifyMutation.isPending}
        isResending={resendMutation.isPending}
        onSubmit={handleVerify}
        onResend={handleResend}
      />
    </>
  );
}
