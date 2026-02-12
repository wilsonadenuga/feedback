import { ComponentProps, ReactNode } from "react";
import { cn } from "@feedback/ui/lib/utils";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  containerProps?: ComponentProps<"div">;
}

export function EmptyState({
  title,
  description,
  action,
  containerProps,
}: EmptyStateProps) {
  return (
    <div
      {...containerProps}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center border rounded-md bg-muted w-full",
        containerProps?.className,
      )}
    >
      <div className="mb-4">
        <Image
          src="/images/welcome.png"
          alt="no-content"
          width={350}
          height={50}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
