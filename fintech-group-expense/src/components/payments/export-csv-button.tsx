"use client";

import { useState } from "react";
import { Download, Check, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportCSVButtonProps {
  onExport: () => void;
  filename?: string;
  className?: string;
}

export function ExportCSVButton({
  onExport,
  filename = "export",
  className,
}: ExportCSVButtonProps) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    onExport();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <button
      onClick={handleExport}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
        exported
          ? "border-success bg-success/10 text-success"
          : "border-border/50 bg-secondary/30 text-foreground hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      {exported ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Exported!</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4" />
          <span className="text-sm font-medium">Export CSV</span>
        </>
      )}
    </button>
  );
}
