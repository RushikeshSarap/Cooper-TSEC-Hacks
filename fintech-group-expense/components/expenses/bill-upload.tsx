"use client";

import React from "react"

import { useState, useRef } from "react";
import { Camera, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface BillUploadProps {
  onImageCapture?: (imageData: string) => void;
  onScanComplete?: (data: { total: number; items: string[] }) => void;
}

export function BillUpload({ onImageCapture, onScanComplete }: BillUploadProps) {
  const [mode, setMode] = useState<"idle" | "camera" | "preview" | "scanning">("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setMode("preview");
        onImageCapture?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    setMode("scanning");
    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onScanComplete?.({
      total: 156.75,
      items: ["Burger - $18.50", "Pizza - $24.00", "Drinks - $32.00", "Dessert - $15.25"],
    });
    setMode("preview");
  };

  const handleReset = () => {
    setImagePreview(null);
    setMode("idle");
  };

  if (mode === "camera") {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="relative h-full flex flex-col">
          {/* Camera viewfinder overlay */}
          <div className="flex-1 bg-muted flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-secondary rounded-2xl overflow-hidden">
              <div className="absolute inset-4 border-2 border-dashed border-primary/50 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Position receipt within frame
                  </p>
                </div>
              </div>
              {/* Corner guides */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary" />
            </div>
          </div>

          {/* Camera controls */}
          <div className="p-6 bg-card border-t border-border">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setMode("idle")}
                className="p-3 rounded-full bg-secondary"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
              <button
                onClick={() => {
                  // Simulate capture
                  setImagePreview("/placeholder-receipt.jpg");
                  setMode("preview");
                }}
                className="p-4 rounded-full gradient-primary shadow-lg"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full bg-secondary"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "preview" || mode === "scanning") {
    return (
      <GlassCard className="p-4">
        <div className="relative">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
            {imagePreview ? (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Receipt preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Receipt preview</p>
                </div>
              </div>
            )}

            {mode === "scanning" && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-sm font-medium text-foreground">Scanning receipt...</p>
                <p className="text-xs text-muted-foreground">Extracting expense details</p>
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {mode === "preview" && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium"
            >
              Retake
            </button>
            <button
              onClick={handleScan}
              className="flex-1 py-3 rounded-xl gradient-primary text-white font-medium"
            >
              Scan Receipt
            </button>
          </div>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary-subtle mb-4">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Upload Receipt</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Scan your receipt to auto-fill expense details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("camera")}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
            "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <Camera className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Take Photo</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
            "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <Upload className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Upload File</span>
        </button>
      </div>
    </GlassCard>
  );
}
