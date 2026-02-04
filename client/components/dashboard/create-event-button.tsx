"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CreateEventButtonProps {
  className?: string;
}

export function CreateEventButton({ className }: CreateEventButtonProps) {
  return (
    <Link
      href="/events/create"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center justify-center w-14 h-14 rounded-full",
        "gradient-primary shadow-lg shadow-primary/30",
        "hover:scale-110 hover:shadow-glow active:scale-95",
        "transition-all duration-300",
        className
      )}
    >
      <Plus className="w-6 h-6 text-white" />
      <span className="sr-only">Create new event</span>
    </Link>
  );
}
