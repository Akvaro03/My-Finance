"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { logIn } from "@/services/authService";

function FormLogin({ goToSign }: { goToSign?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const goToDashboard = () => {
    window.location.href = "/";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await logIn({ email, password });
      goToDashboard();
      setError("");
    } catch (e) {
      setError(
        e ? String(e) : "An unexpected error occurred. Please try again later."
      );
    }
    setIsLoading(false);
  };

  return (
    <Card className="login-card shadow-2xl border-slate-700/50">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:bg-slate-800/70"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:bg-slate-800/70 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-sky-500 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          {/* <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Forgot your password?
          </button> */}
          <p className="text-slate-500 text-sm">
            Dont have an account?{" "}
            <button
              onClick={goToSign}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormLogin;
