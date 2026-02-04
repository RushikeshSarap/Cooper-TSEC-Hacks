"use client";

import { useState } from "react";
import { X, Shield, CheckCircle2, Loader2, AlertCircle, Fingerprint } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

interface PaymentAuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  recipient: {
    name: string;
    avatar?: string;
  };
  eventName: string;
}

export function PaymentAuthorizationModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  recipient,
  eventName,
}: PaymentAuthorizationModalProps) {
  const [status, setStatus] = useState<"idle" | "authorizing" | "success" | "error">("idle");

  const handleAuthorize = async () => {
    setStatus("authorizing");
    // Simulate authorization
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 mb-0 sm:mb-0 bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Confirm Payment</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Sent!</h3>
              <p className="text-muted-foreground">
                Your payment of ${amount.toFixed(2)} has been sent to {recipient.name}
              </p>
            </div>
          ) : status === "error" ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Failed</h3>
              <p className="text-muted-foreground">
                Something went wrong. Please try again.
              </p>
              <GradientButton onClick={() => setStatus("idle")} className="mt-6">
                Try Again
              </GradientButton>
            </div>
          ) : (
            <>
              {/* Amount */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">You are sending</p>
                <p className="text-4xl font-bold gradient-text">${amount.toFixed(2)}</p>
              </div>

              {/* Recipient */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-secondary/30 mb-6">
                <UserAvatar name={recipient.name} avatar={recipient.avatar} size="lg" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">{recipient.name}</p>
                  <p className="text-sm text-muted-foreground">{eventName}</p>
                </div>
              </div>

              {/* Authorization */}
              {status === "authorizing" ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-foreground font-medium">Authorizing payment...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please wait while we process your transaction
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <GradientButton
                      onClick={handleAuthorize}
                      className="w-full"
                      size="lg"
                    >
                      <Fingerprint className="w-5 h-5 mr-2" />
                      Authorize Payment
                    </GradientButton>

                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By authorizing, you agree to the payment terms and conditions
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
