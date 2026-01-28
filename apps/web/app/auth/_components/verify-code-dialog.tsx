"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@feedback/ui/components/dialog";
import { Button } from "@feedback/ui/components/button";
import { Input } from "@feedback/ui/components/input";

const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;

type Mode = "login" | "register";

const MODE_CONFIG: Record<
  Mode,
  {
    title: string;
    description: string;
    submitLabel: string;
    submittingLabel: string;
  }
> = {
  login: {
    title: "Enter Login Code",
    description:
      "We've sent a login code to {email}. Enter the code below to sign in.",
    submitLabel: "Sign In",
    submittingLabel: "Signing In...",
  },
  register: {
    title: "Verify Your Email",
    description:
      "We've sent a verification code to {email}. Enter the code below to complete your registration.",
    submitLabel: "Verify Email",
    submittingLabel: "Verifying...",
  },
};

interface VerifyCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  email: string;
  isSubmitting: boolean;
  isResending: boolean;
  onSubmit: (code: string) => void;
  onResend: () => void;
}

export function VerifyCodeDialog({
  open,
  onOpenChange,
  mode,
  email,
  isResending,
  onSubmit,
  onResend,
}: VerifyCodeDialogProps) {
  const config = MODE_CONFIG[mode];

  const {
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
  } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmitForm = (data: VerifyCodeForm) => {
    onSubmit(data.code);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            {config.description.replace("{email}", email)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Input
              {...register("code")}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoComplete="one-time-code"
            />
            {errors.code ? (
              <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? config.submittingLabel : config.submitLabel}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onResend}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? "Sending..." : "Resend code"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
