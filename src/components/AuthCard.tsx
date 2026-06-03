"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Phone, Lock, User, MapPin, ArrowRight, Check, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/api/hooks";
import { toast } from "sonner";
import { YandexMapModal } from "./YandexMapModal";

interface AuthCardProps {
  onClose?: () => void;
}

export function AuthCard({ onClose }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  // Form states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState(false);

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
        toast.error("Telefon raqami yoki parol xato. Qaytadan urinib ko'ring.");
      } else {
        toast.success("Xush kelibsiz!");
        router.push("/discover");
      }
    } catch (error) {
      toast.error("Tizimga kirishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerStep === 1) {
      setRegisterStep(2);
      // Attempt to retrieve coordinate location automatically
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
          },
          () => {}
        );
      }
    } else {
      setIsLoading(true);
      try {
        await registerMutation.mutateAsync({
          phone_number: phone,
          password,
          full_name: fullName,
          location,
          latitude,
          longitude,
        } as any);
        
        // After successful registration, log them in automatically
        const res = await signIn("credentials", {
          phone_number: phone,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast.error("Hisob yaratildi, lekin avtomatik kirish amalga oshmadi.");
        } else {
          toast.success("ShareFlow hamjamiyatiga xush kelibsiz!");
          router.push("/discover");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Ro'yxatdan o'tish muvaffaqiyatsiz tugadi. Qayta urinib ko'ring.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-md mx-auto bg-card text-card-foreground border border-border/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      {/* Close Button inside Card */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer z-50 border border-border/40 hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            ShareFlow
          </span>
        </div>

        {/* Custom iOS/Pill style Mode Switcher */}
        <div className="relative flex p-1 bg-muted rounded-2xl mb-6">
          <motion.div
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-card rounded-xl shadow-sm border border-border/20"
            animate={{
              x: mode === "login" ? 0 : "100%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setRegisterStep(1);
            }}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center ${
              mode === "login" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center ${
              mode === "register" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Stepped Progress for Register */}
        {mode === "register" && (
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                registerStep === 1 
                  ? "bg-primary text-primary-foreground font-extrabold" 
                  : "bg-emerald-500/20 text-primary border border-primary/20"
              }`}>
                1
              </span>
              <span className={`text-xs font-semibold ${registerStep === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                Ma'lumotlar
              </span>
            </div>
            <div className="flex-1 h-px bg-border mx-3" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                registerStep === 2 
                  ? "bg-primary text-primary-foreground font-extrabold" 
                  : "bg-muted text-muted-foreground"
              }`}>
                2
              </span>
              <span className={`text-xs font-semibold ${registerStep === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                Manzil
              </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-phone" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Telefon raqami
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="login-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-6 rounded-xl hover-lift tactile-scale text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10">
                <span className="flex items-center gap-2 justify-center w-full">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Kirish <ArrowRight className="w-5 h-5" /></>}
                </span>
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              className="space-y-5"
            >
              <AnimatePresence mode="wait">
                {registerStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="reg-name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ism va familiya
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="reg-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Foydalanuvchi ismi"
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reg-phone" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Telefon raqami
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="reg-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="reg-password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Parol
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label htmlFor="reg-location" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Mahallangiz / Hudud
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          id="reg-location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Masalan: Yunusobod 4-daha, Chilonzar"
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground text-sm font-medium"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMapModal(true)}
                        className="w-full py-5 rounded-xl border-dashed border-primary/40 hover:border-primary text-primary flex items-center justify-center gap-2 mt-3 font-medium transition-all hover:bg-primary/5 active:scale-98 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4" />
                        {latitude && longitude ? "Xaritadagi manzilni o'zgartirish" : "Xaritadan manzilni belgilash"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Bu sizga eng yaqin masofadagi buyumlarni ko'rsatishimizga yordam beradi.
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3 mt-4">
                      <Leaf className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground leading-normal">
                        ShareFlow hamjamiyatiga qo'shilish orqali siz o'zaro ishonch va beg'araz yordam qoidalariga rioya qilishga rozilik bildirasiz.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                {registerStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegisterStep(1)}
                    className="py-6 px-5 rounded-xl hover-lift tactile-scale border-border hover:bg-muted text-foreground transition-all cursor-pointer font-semibold"
                  >
                    Orqaga
                  </Button>
                )}
                <Button type="submit" disabled={isLoading} className="w-full py-6 rounded-xl hover-lift tactile-scale text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 flex-1">
                  <span className="flex items-center gap-2 justify-center w-full">
                    {isLoading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : registerStep === 1 ? (
                      <>Davom etish <ArrowRight className="w-5 h-5" /></>
                    ) : (
                      <>Qo'shilish <Check className="w-5 h-5" /></>
                    )}
                  </span>
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {showMapModal && (
        <YandexMapModal
          initialLat={latitude}
          initialLng={longitude}
          initialAddress={location}
          onClose={() => setShowMapModal(false)}
          onSelect={(lat, lng, addr) => {
            setLatitude(lat);
            setLongitude(lng);
            setLocation(addr);
          }}
        />
      )}
    </motion.div>
  );
}

