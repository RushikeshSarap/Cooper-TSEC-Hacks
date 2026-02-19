"use client";

import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Users,
  Receipt,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Group Events",
    description:
      "Create shared wallets for trips, parties, or any group activity",
  },
  {
    icon: Receipt,
    title: "Smart Splitting",
    description: "OCR-powered bill scanning with customizable split rules",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Bank-grade security with biometric authentication and encryption",
  },
  {
    icon: TrendingUp,
    title: "Real-time Tracking",
    description: "Live expense tracking with instant settlement calculations",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary-subtle opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <header className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">SplitFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <GradientButton size="sm">Get Started</GradientButton>
              </Link>
            </div>
          </nav>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              The future of group expenses
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            Split expenses{" "}
            <span className="gradient-text">without the hassle</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Create shared wallets, track expenses in real-time, and settle
            balances instantly. Perfect for trips, roommates, or any group
            activity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <GradientButton size="lg" className="text-lg px-8">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <p className="text-4xl font-bold gradient-text">50K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">$2M+</p>
              <p className="text-sm text-muted-foreground">Settled Monthly</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">4.9</p>
              <p className="text-sm text-muted-foreground">App Rating</p>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to manage group finances
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From creating events to settling balances, SplitFlow handles it all
            with elegance and security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <GlassCard
              key={feature.title}
              className="p-6 hover:shadow-glow transition-shadow duration-300"
            >
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <GlassCard className="p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary-subtle opacity-30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to simplify group expenses?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of users who have made splitting bills effortless.
            </p>
            <Link href="/register">
              <GradientButton size="lg" className="text-lg px-8">
                Create Your First Event
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SplitFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for hassle-free group finances
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
