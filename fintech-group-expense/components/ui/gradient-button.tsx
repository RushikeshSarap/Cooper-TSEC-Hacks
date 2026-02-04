"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function GradientButton({
  className,
  children,
  loading,
  variant = "default",
  size = "default",
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "gradient-primary text-white shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        variant === "outline" && "border-2 border-transparent bg-clip-padding gradient-primary-subtle hover:gradient-primary hover:text-white",
        variant === "ghost" && "hover:gradient-primary-subtle",
        size === "default" && "h-11 px-6 text-sm",
        size === "sm" && "h-9 px-4 text-xs",
        size === "lg" && "h-14 px-8 text-base",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
