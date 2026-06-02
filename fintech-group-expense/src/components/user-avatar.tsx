"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatus?: boolean;
  status?: "online" | "offline" | "away";
}

export function UserAvatar({
  name,
  avatar,
  size = "md",
  className,
  showStatus,
  status = "offline",
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const statusClasses = {
    online: "bg-success",
    offline: "bg-muted-foreground",
    away: "bg-warning",
  };

  return (
    <div className={cn("relative", className)}>
      {avatar ? (
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className={cn(
            "rounded-full object-cover ring-2 ring-border",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full gradient-primary text-white font-semibold ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-card",
            size === "sm" ? "h-2 w-2" : "h-3 w-3",
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
}
