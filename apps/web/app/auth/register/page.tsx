"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@feedback/schema";
import {
  useRegister,
  useConfirmEmail,
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

export default function RegisterPage() {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const registerMutation = useRegister();
  const confirmEmailMutation = useConfirmEmail();
  const resendMutation = useResendVerification();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setEmail(data.email);
        setShowVerifyDialog(true);
      },
    });
  };

  const handleVerify = (code: string) => {
    confirmEmailMutation.mutate(
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
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...form.register("name")}
                  placeholder="Full name"
                  type="text"
                />
                {form.formState.errors.name ? (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </div>

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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <VerifyCodeDialog
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
        mode="register"
        email={email}
        isSubmitting={confirmEmailMutation.isPending}
        isResending={resendMutation.isPending}
        onSubmit={handleVerify}
        onResend={handleResend}
      />
    </>
  );
}
