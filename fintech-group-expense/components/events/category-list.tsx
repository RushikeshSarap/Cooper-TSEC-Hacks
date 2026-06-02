"use client";

import { Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
  onAddCategory?: () => void;
}

const categoryIcons: Record<string, string> = {
  food: "🍽️",
  transport: "🚗",
  accommodation: "🏨",
  entertainment: "🎭",
  shopping: "🛍️",
  drinks: "🍻",
  activities: "🎿",
  other: "📦",
};

export function CategoryList({ categories, onAddCategory }: CategoryListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const progress = (category.spent / category.budget) * 100;
          const isOverBudget = progress > 100;

          return (
            <GlassCard
              key={category.id}
              className={cn(
                "p-4 cursor-pointer hover:shadow-lg transition-all",
                isOverBudget && "border-destructive/30"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {categoryIcons[category.icon] || categoryIcons.other}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.participantIds.length} members
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={cn(
                      "font-semibold",
                      isOverBudget ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {formatCurrency(category.spent)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    / {formatCurrency(category.budget)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOverBudget
                        ? "bg-destructive"
                        : progress > 70
                          ? "bg-warning"
                          : "gradient-primary"
                    )}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}

        <button
          onClick={onAddCategory}
          className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[120px]"
        >
          <div className="p-2 rounded-full bg-secondary mb-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Add Category</p>
        </button>
      </div>
    </div>
  );
}
