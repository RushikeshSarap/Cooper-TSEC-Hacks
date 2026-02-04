"use client";

import { useState } from "react";
import { Wallet, Shield, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const walletOptions = [
  {
    id: "finternet",
    name: "Finternet Wallet",
    icon: "🌐",
    description: "Connect your Finternet wallet",
    recommended: true,
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask",
    recommended: false,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Scan with WalletConnect",
    recommended: false,
  },
];

export function WalletConnect() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (!selectedWallet) return;
    setConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setConnecting(false);
    setConnected(true);
  };

  if (connected) {
    return (
      <GlassCard variant="strong" className="w-full max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Wallet Connected</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Your wallet has been successfully connected to SplitFlow
        </p>
        <div className="p-4 rounded-xl bg-secondary/50 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
          <p className="font-mono text-sm text-foreground">0x1234...5678</p>
        </div>
        <GradientButton className="w-full">
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </GradientButton>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="strong" className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4">
          <Wallet className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Connect Wallet</h1>
        <p className="text-muted-foreground mt-1">
          Link your wallet to enable payments and settlements
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {walletOptions.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => setSelectedWallet(wallet.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
              selectedWallet === wallet.id
                ? "border-primary bg-primary/5 shadow-glow/50"
                : "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-border"
            )}
          >
            <span className="text-2xl">{wallet.icon}</span>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{wallet.name}</span>
                {wallet.recommended && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full gradient-primary text-white">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{wallet.description}</p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all",
                selectedWallet === wallet.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {selectedWallet === wallet.id && (
                <CheckCircle2 className="w-full h-full text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 mb-6">
        <Shield className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Secure Connection</p>
          <p className="text-xs text-muted-foreground">
            We never store your private keys or have access to your funds.
          </p>
        </div>
      </div>

      <GradientButton
        className="w-full"
        disabled={!selectedWallet}
        onClick={handleConnect}
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            Connect Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </GradientButton>
    </GlassCard>
  );
}
