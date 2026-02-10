"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@feedback/schema";
import { useRegister } from "@/hooks/api/use-auth";
import { Button } from "@feedback/ui/components/button";
import { Input } from "@feedback/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        router.push(
          `/auth/register/verify-code?email=${encodeURIComponent(data.email)}`,
        );
      },
    });
  };

  return (
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
  );
}
