"use client";

import { DollarSign, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const categoryIcons = [
  { id: "food", label: "Food", emoji: "🍽️" },
  { id: "transport", label: "Transport", emoji: "🚗" },
  { id: "accommodation", label: "Stay", emoji: "🏨" },
  { id: "entertainment", label: "Fun", emoji: "🎭" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "drinks", label: "Drinks", emoji: "🍻" },
  { id: "activities", label: "Activities", emoji: "🎿" },
  { id: "other", label: "Other", emoji: "📦" },
];

interface CategoryFormData {
  name: string;
  icon: string;
  budget: string;
}

interface CategoryFormProps {
  data: CategoryFormData;
  onChange: (data: CategoryFormData) => void;
}

export function CategoryForm({ data, onChange }: CategoryFormProps) {
  const updateField = <K extends keyof CategoryFormData>(
    field: K,
    value: CategoryFormData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="categoryName" className="text-sm font-medium">
          Category Name
        </Label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="categoryName"
            placeholder="e.g., Food & Drinks"
            className={cn(
              "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
              "focus:border-primary focus:ring-primary/20"
            )}
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Category Icon</Label>
        <div className="grid grid-cols-4 gap-2">
          {categoryIcons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => updateField("icon", icon.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                data.icon === icon.id
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:border-primary/30"
              )}
            >
              <span className="text-2xl">{icon.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{icon.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className="text-sm font-medium">
          Budget Limit
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="budget"
            type="number"
            placeholder="0.00"
            className={cn(
              "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
              "focus:border-primary focus:ring-primary/20"
            )}
            value={data.budget}
            onChange={(e) => updateField("budget", e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Leave empty for no budget limit
        </p>
      </div>
    </div>
  );
}
