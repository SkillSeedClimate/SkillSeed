import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-card-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[44px] w-full rounded-xl border bg-input-background px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground transition-all",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/30"
              : "border-border",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-card-foreground"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[100px] w-full resize-none rounded-xl border bg-input-background px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground transition-all",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/30"
              : "border-border",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";
