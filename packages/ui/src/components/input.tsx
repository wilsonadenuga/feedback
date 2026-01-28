import * as React from "react"

import { cn } from "@feedback/ui/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string | { message?: string }
}

function Input({ className, type, label, error, id, ...props }: InputProps) {
  const errorMessage = typeof error === "string" ? error : error?.message
  const hasError = !!errorMessage
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        data-slot="input"
        aria-invalid={hasError}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {hasError && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}

export { Input }
