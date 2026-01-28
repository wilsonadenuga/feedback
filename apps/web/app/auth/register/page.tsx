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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  console.log("RegisterPage render", errors);

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
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Enter your information to create a new account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("name")}
            label="Name"
            placeholder="Enter your name"
            type="text"
            error={errors.name}
          />

          <Input
            {...register("email")}
            label="Email"
            placeholder="Enter your email"
            type="email"
            error={errors.email}
          />

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
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
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
