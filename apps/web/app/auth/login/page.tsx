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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@feedback/ui/components/card";
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your email to receive a login code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...form.register("email")}
                  placeholder="Email address"
                  type="email"
                />
                {form.formState.errors.email ? (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? "Sending Code..."
                  : "Send Login Code"}
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
          </CardContent>
        </Card>
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
