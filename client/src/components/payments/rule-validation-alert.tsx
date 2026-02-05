"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RuleValidation {
  id: string;
  rule: string;
  status: "pass" | "fail" | "warning";
  message: string;
}

interface RuleValidationAlertProps {
  validations: RuleValidation[];
  className?: string;
}

export function RuleValidationAlert({ validations, className }: RuleValidationAlertProps) {
  const hasFailures = validations.some((v) => v.status === "fail");
  const hasWarnings = validations.some((v) => v.status === "warning");

  const statusIcons = {
    pass: <CheckCircle2 className="w-4 h-4 text-success" />,
    fail: <XCircle className="w-4 h-4 text-destructive" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  };

  const statusStyles = {
    pass: "border-success/20 bg-success/5",
    fail: "border-destructive/20 bg-destructive/5",
    warning: "border-warning/20 bg-warning/5",
  };

  if (validations.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        hasFailures
          ? "border-destructive/30 bg-destructive/5"
          : hasWarnings
            ? "border-warning/30 bg-warning/5"
            : "border-success/30 bg-success/5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {hasFailures ? (
          <XCircle className="w-5 h-5 text-destructive" />
        ) : hasWarnings ? (
          <AlertTriangle className="w-5 h-5 text-warning" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-success" />
        )}
        <span className="font-semibold text-foreground">
          {hasFailures
            ? "Payment Blocked"
            : hasWarnings
              ? "Payment Requires Attention"
              : "All Rules Passed"}
        </span>
      </div>

      <div className="space-y-2">
        {validations.map((validation) => (
          <div
            key={validation.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border",
              statusStyles[validation.status]
            )}
          >
            {statusIcons[validation.status]}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{validation.rule}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {validation.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasFailures && (
        <p className="text-xs text-muted-foreground mt-3">
          This payment cannot proceed until all rules pass. Contact an organizer for approval.
        </p>
      )}
    </div>
  );
}
