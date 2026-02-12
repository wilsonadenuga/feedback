import { Spinner } from "@feedback/ui/components/spinner";
import { cn } from "@feedback/ui/lib/utils";
import { ComponentProps } from "react";

interface PageSpinnerProps {
  containerProps?: ComponentProps<"div">;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-12",
};

export function PageSpinner({ containerProps, size = "md" }: PageSpinnerProps) {
  return (
    <div
      {...containerProps}
      className={cn(
        "flex items-center justify-center min-h-[60vh]",
        containerProps?.className,
      )}
    >
      <Spinner className={cn("text-primary", sizeClasses[size])} />
    </div>
  );
}
