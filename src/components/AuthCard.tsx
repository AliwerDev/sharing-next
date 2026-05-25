"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Phone, Lock, User, MapPin, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/api/hooks";
import { toast } from "sonner";

export function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  // Form states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const registerMutation = useRegister();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        phone_number: phone,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back!");
        router.push("/discover");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerStep === 1) {
      setRegisterStep(2);
    } else {
      setIsLoading(true);
      try {
        await registerMutation.mutateAsync({
          phone_number: phone,
          password,
          full_name: fullName,
          location,
        });
        
        // After successful registration, log them in automatically
        const res = await signIn("credentials", {
          phone_number: phone,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast.error("Account created, but couldn't log in automatically.");
        } else {
          toast.success("Welcome to ShareFlow!");
          router.push("/discover");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed. Try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-effect rounded-2xl p-8 card-elevation relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex gap-4 mb-8 border-b border-border pb-4">
          <button
            onClick={() => {
              setMode("login");
              setRegisterStep(1);
            }}
            className={`text-lg font-semibold transition-colors ${
              mode === "login" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`text-lg font-semibold transition-colors ${
              mode === "register" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="login-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-6 rounded-xl hover-lift tactile-scale text-lg">
                <span className="flex items-center gap-2">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                </span>
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {registerStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="reg-name" className="block text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="reg-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reg-phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="reg-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reg-password" className="block text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="reg-location" className="block text-sm font-medium">
                        Your Neighborhood
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="reg-location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Downtown, Block 4"
                          className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        This helps us show you items shared nearby.
                      </p>
                    </div>

                    <div className="p-4 bg-accent/30 border border-accent rounded-xl flex items-start gap-3 mt-4">
                      <Leaf className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm">
                        Joining ShareFlow means you agree to our community guidelines of trust and altruism.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                {registerStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegisterStep(1)}
                    className="py-6 rounded-xl hover-lift tactile-scale"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" disabled={isLoading} className="w-full py-6 rounded-xl hover-lift tactile-scale text-lg flex-1">
                  <span className="flex items-center gap-2">
                    {isLoading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : registerStep === 1 ? (
                      <>Continue <ArrowRight className="w-5 h-5" /></>
                    ) : (
                      <>Join Community <Check className="w-5 h-5" /></>
                    )}
                  </span>
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
