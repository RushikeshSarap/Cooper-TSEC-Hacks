"use client";


import { Calendar, DollarSign, FileText, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  coverImage?: string;
}

interface EventFormProps {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
}

export function EventForm({ data, onChange }: EventFormProps) {
  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Event Name
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="e.g., Summer Vacation 2026"
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
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="What's this event about?"
          className={cn(
            "min-h-[100px] rounded-xl bg-secondary/50 border-border/50",
            "focus:border-primary focus:ring-primary/20"
          )}
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="startDate"
              type="date"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={data.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="endDate"
              type="date"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={data.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className="text-sm font-medium">
          Total Budget
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
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Cover Image (Optional)</Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            "border-border/50 hover:border-primary/50 cursor-pointer"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-secondary">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Click to upload</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
