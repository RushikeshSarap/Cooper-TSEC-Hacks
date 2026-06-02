"use client";

import { useState } from "react";
import { Plus, Trash2, Shield, DollarSign, Clock, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { Rule } from "@/types";

const ruleTypes = [
  {
    type: "spending_limit" as const,
    label: "Daily Spending Limit",
    icon: DollarSign,
    description: "Maximum amount per day",
    placeholder: "500",
  },
  {
    type: "category_limit" as const,
    label: "Category Limit",
    icon: Shield,
    description: "Maximum per category",
    placeholder: "200",
  },
  {
    type: "approval_required" as const,
    label: "Require Approval",
    icon: CheckSquare,
    description: "Expenses above amount need approval",
    placeholder: "100",
  },
  {
    type: "time_restriction" as const,
    label: "Time Window",
    icon: Clock,
    description: "Allow expenses only during hours",
    placeholder: "9:00-18:00",
  },
];

interface RuleBuilderProps {
  rules: Rule[];
  onRulesChange: (rules: Rule[]) => void;
}

export function RuleBuilder({ rules, onRulesChange }: RuleBuilderProps) {
  const [showAddRule, setShowAddRule] = useState(false);

  const addRule = (type: Rule["type"]) => {
    const ruleType = ruleTypes.find((r) => r.type === type);
    if (!ruleType) return;

    const newRule: Rule = {
      id: Date.now().toString(),
      name: ruleType.label,
      type,
      value: "",
      enabled: true,
    };
    onRulesChange([...rules, newRule]);
    setShowAddRule(false);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    onRulesChange(
      rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const removeRule = (id: string) => {
    onRulesChange(rules.filter((rule) => rule.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Spending Rules</h3>
          <p className="text-sm text-muted-foreground">
            Set limits and controls for this event
          </p>
        </div>
        <button
          onClick={() => setShowAddRule(!showAddRule)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            showAddRule
              ? "bg-secondary text-foreground"
              : "gradient-primary text-white"
          )}
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {showAddRule && (
        <GlassCard className="p-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Select rule type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ruleTypes.map((ruleType) => {
              const Icon = ruleType.icon;
              return (
                <button
                  key={ruleType.type}
                  onClick={() => addRule(ruleType.type)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-primary/30 transition-all text-left"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ruleType.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ruleType.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {rules.length > 0 && (
        <div className="space-y-3">
          {rules.map((rule) => {
            const ruleType = ruleTypes.find((r) => r.type === rule.type);
            const Icon = ruleType?.icon || Shield;

            return (
              <GlassCard key={rule.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) =>
                          updateRule(rule.id, { enabled: checked })
                        }
                      />
                    </div>
                    <Input
                      type={rule.type === "time_restriction" ? "text" : "number"}
                      placeholder={ruleType?.placeholder}
                      value={rule.value}
                      onChange={(e) =>
                        updateRule(rule.id, { value: e.target.value })
                      }
                      className={cn(
                        "h-10 rounded-xl bg-secondary/50 border-border/50",
                        "focus:border-primary focus:ring-primary/20"
                      )}
                    />
                  </div>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {rules.length === 0 && !showAddRule && (
        <GlassCard className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            No rules set. Add rules to control spending.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
