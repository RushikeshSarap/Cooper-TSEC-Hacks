"use client";

import { X, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

interface NotificationBannerProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
}

export function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
    error: AlertCircle,
  };

  const styles = {
    info: "bg-primary/10 border-primary/20 text-primary",
    warning: "bg-warning/10 border-warning/20 text-warning",
    success: "bg-success/10 border-success/20 text-success",
    error: "bg-destructive/10 border-destructive/20 text-destructive",
  };

  const Icon = icons[notification.type];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.(notification.id);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border transition-all duration-300",
        styles[notification.type]
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{notification.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="p-1 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
