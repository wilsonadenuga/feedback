"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@feedback/ui/components/input-otp";
import { Button } from "@feedback/ui/components/button";

const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;

interface VerifyCodeInputProps {
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
}

export function VerifyCodeInput({
  onSubmit,
  isSubmitting,
}: VerifyCodeInputProps) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const code = useWatch({ control, name: "code" });

  const handleFormSubmit = (data: VerifyCodeForm) => {
    onSubmit(data.code);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) =>
            setValue("code", value, { shouldValidate: true })
          }
          autoFocus
        >
          <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {code?.length > 0 && code.length < 6 && (
          <p className="text-sm text-muted-foreground">
            Enter {6 - code.length} more digit{6 - code.length !== 1 ? "s" : ""}
          </p>
        )}
        {errors.code && (
          <p className="text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
