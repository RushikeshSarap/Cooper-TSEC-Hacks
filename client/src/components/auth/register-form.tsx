"use client";

import React, { useState } from "react";
import axios from "axios"; // ✅ Import axios
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import dotenv from "dotenv";

dotenv.config();

const BACKEND_AUTH_URL = process.env.BACKEND_AUTH_URL || "http://localhost:5000/api/v1/auth/register";

// ✅ If using Next.js, use `next/link` instead:
// import Link from "next/link"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ✅ Backend connection using axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Change this URL to your backend endpoint
      const response = await axios.post(BACKEND_AUTH_URL, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // ✅ Example success response
      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setSuccess("Account created successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        window.location.href = "/login"; // Redirect to dashboard on success
      }
    } catch (err: any) {
      // ✅ Handle backend error messages
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const strength = passwordStrength();
  const strengthColor =
    strength <= 25
      ? "bg-destructive"
      : strength <= 50
      ? "bg-warning"
      : strength <= 75
      ? "bg-chart-3"
      : "bg-success";

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
        <h1 className="text-2xl font-bold text-foreground">Create account</h1>
        <p className="text-muted-foreground mt-1">
          Start managing group expenses today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Error / Success messages */}
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
          <Label htmlFor="name" className="text-sm font-medium">
            Full name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20"
              )}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

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
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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
          {formData.password && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    strengthColor
                  )}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {strength <= 25
                  ? "Weak"
                  : strength <= 50
                  ? "Fair"
                  : strength <= 75
                  ? "Good"
                  : "Strong"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className={cn(
                "pl-10 h-12 rounded-xl bg-secondary/50 border-border/50",
                "focus:border-primary focus:ring-primary/20",
                formData.confirmPassword &&
                  formData.password !== formData.confirmPassword &&
                  "border-destructive focus:border-destructive"
              )}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <GradientButton type="submit" className="w-full mt-6" loading={loading}>
          {loading ? "Creating..." : "Create account"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </GradientButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </GlassCard>
  );
}
