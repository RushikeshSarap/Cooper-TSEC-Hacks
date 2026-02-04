"use client";

import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom"; // ✅ For navigation after login

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ Send login request to backend API
      const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // ✅ If login successful
      if (response.status === 200) {
        const { token, user, message } = response.data;

        // ✅ Save token & user info to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess(message || "Login successful");

        // ✅ Redirect after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard variant="strong" className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Sign in to your SplitFlow account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ✅ Success / Error messages */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-success bg-success/10 p-2 rounded-md">
            {success}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={cn(
                "pl-10 pr-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <GradientButton type="submit" className="w-full" loading={loading}>
          {loading ? "Signing in..." : "Sign in"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </GradientButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </p>
    </GlassCard>
  );
}
