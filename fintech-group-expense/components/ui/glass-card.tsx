"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "gradient";
}

export function GlassCard({
  className,
  children,
  variant = "default",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variant === "default" && "glass shadow-soft",
        variant === "strong" && "glass-strong shadow-lg",
        variant === "gradient" && "gradient-primary-subtle glass shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
