"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ArrowRight, CheckCircle2, Phone, MapPin, 
  RotateCcw, Lock, Unlock, Sparkles, Plus, 
  Gift, Heart, Award, ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";

export function InteractiveSimulator() {
  const [step, setStep] = useState(1);
  const [jasurKarma, setJasurKarma] = useState(40);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when handover completes
  useEffect(() => {
    if (step === 5) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#3b82f6"]
      });
      
      const interval = setInterval(() => {
        if (jasurKarma < 50) {
          setJasurKarma(prev => prev + 1);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setJasurKarma(40);
    }
  }, [step]);

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      setStep(1);
    }
  };

  const stepsInfo = [
    {
      title: "1. E'lon joylashtirish",
      desc: "Jasur o'ziga ortiqcha bo'lgan mexanik klaviaturani bepul tarqatish uchun tizimga joylashtirmoqda.",
      action: "E'lonni faollashtirish",
      detail: "Buyum holati: ACTIVE (Faol)"
    },
    {
      title: "2. Qidiruv va So'rov",
      desc: "Shahlo o'ziga yaqin hududdagi klaviaturani topdi va Jasurga uni olish uchun so'rov yubordi.",
      action: "So'rov yuborish",
      detail: "Jasurning telefon raqami hozircha yashirin (xavfsizlik uchun)"
    },
    {
      title: "3. Tasdiqlash va Aloqa",
      desc: "Jasur Shahloning ajoyib obro'sini (Karma reytingini) ko'rdi va so'rovni qabul qildi.",
      action: "So'rovni qabul qilish",
      detail: "Telefon raqamlari ochildi! Endi ular bog'lanib, uchrashuvni kelishishlari mumkin."
    },
    {
      title: "4. Mahalliy topshirish",
      desc: "Ular mahalliy parkda uchrashishdi va Jasur mexanik klaviaturani Shahloga topshirdi.",
      action: "Topshirishni tasdiqlash",
      detail: "Shahlo klaviaturani qabul qilib oldi."
    },
    {
      title: "5. Karma va Sovg'alar!",
      desc: "Muvaffaqiyatli topshirilganidan keyin Jasurga +10 Karma ochkosi berildi. Eco Hero unvoni ochildi!",
      action: "Simulyatsiyani qaytadan boshlash",
      detail: "Tabriklaymiz! Mahallangiz endi yashilroq va ahilroq!"
    }
  ];

  return (
    <div className="w-full glass-effect rounded-3xl p-6 md:p-10 card-elevation relative overflow-hidden">
      {/* Background glowing spot */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Controls Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-4 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interaktiv Platforma</span>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ShareFlow qanday ishlaydi?
            </h3>

            {/* Step Indicators */}
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    s === step 
                      ? "bg-primary w-8" 
                      : s < step 
                        ? "bg-primary/50" 
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-semibold text-foreground">
                  {stepsInfo[step - 1].title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {stepsInfo[step - 1].desc}
                </p>
                <div className="p-3.5 bg-card-dark rounded-2xl border border-border/50 text-xs text-secondary font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0 text-secondary" />
                  <span>{stepsInfo[step - 1].detail}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover-lift tactile-scale text-base flex items-center justify-center gap-2 transition-all mt-4"
          >
            {step === 5 ? (
              <>
                <RotateCcw className="w-5 h-5" />
                {stepsInfo[step - 1].action}
              </>
            ) : (
              <>
                {stepsInfo[step - 1].action}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Visual Arena */}
        <div className="lg:col-span-7 bg-card-dark/40 border border-border/40 rounded-2xl p-6 md:p-8 flex flex-col justify-center min-h-[380px] relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 w-full">
            
            {/* User A - Jasur */}
            <motion.div 
              className={`flex flex-col items-center p-4 rounded-2xl bg-card border w-40 text-center relative ${
                step >= 1 ? "border-primary/40 shadow-sm" : "border-border/40"
              }`}
              animate={step === 5 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: step === 5 ? 1 : 0, duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-3 relative">
                <User className="w-7 h-7 text-primary" />
                {step >= 5 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full p-1"
                  >
                    <Award className="w-3 h-3" />
                  </motion.div>
                )}
              </div>
              <h5 className="font-semibold text-sm">Jasur</h5>
              <p className="text-xs text-muted-foreground mb-2">Toshkent, Chilonzor</p>
              
              {/* Jasur's Karma Meter */}
              <div className="w-full bg-muted/50 rounded-full h-4 relative overflow-hidden mt-1 flex items-center justify-center border border-border/30">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full absolute left-0 top-0 transition-all duration-300"
                  style={{ width: `${(jasurKarma / 50) * 100}%` }}
                />
                <span className="text-[10px] font-bold text-foreground z-10">
                  {jasurKarma} Karma
                </span>
              </div>
              <span className="text-[9px] text-amber-500 font-semibold mt-1">
                {jasurKarma >= 50 ? "Eco Hero 👑" : "Giver 🌱"}
              </span>

              {/* Reveal Phone */}
              {step >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Phone className="w-2.5 h-2.5" />
                  +998 90 123-45-67
                </motion.div>
              )}
            </motion.div>

            {/* Connection Line / Animations */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60px] md:min-h-0 relative w-full">
              <div className="w-full h-0.5 border-t border-dashed border-border absolute hidden md:block" />
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1-el"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="bg-primary/20 text-primary p-2.5 rounded-full border border-primary/30 z-10 flex items-center justify-center animate-bounce"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2-el"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold z-10 shadow-md flex items-center gap-1.5"
                  >
                    <span>So'rov yuborildi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3-el"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-emerald-500 text-white p-2.5 rounded-full z-10 shadow-lg flex items-center justify-center"
                  >
                    <Unlock className="w-5 h-5" />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4-el"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="bg-emerald-500 text-white p-3 rounded-full z-10 shadow-lg flex items-center justify-center"
                  >
                    <Gift className="w-5 h-5" />
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div 
                    key="step5-el"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-extrabold px-3 py-1.5 rounded-full text-xs z-10 shadow-lg flex items-center gap-1 border border-amber-300 animate-pulse"
                  >
                    <Sparkles className="w-4 h-4 text-slate-900" />
                    <span>+10 Karma!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User B - Shahlo */}
            <motion.div 
              className={`flex flex-col items-center p-4 rounded-2xl bg-card border w-40 text-center relative ${
                step >= 2 ? "border-primary/40 shadow-sm" : "border-border/40"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 mb-3">
                <User className="w-7 h-7 text-secondary" />
              </div>
              <h5 className="font-semibold text-sm">Shahlo</h5>
              <p className="text-xs text-muted-foreground mb-2">Toshkent, Yunusobod</p>
              
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Tasdiqlangan</span>
              </div>

              {/* Reveal Phone */}
              {step >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Phone className="w-2.5 h-2.5" />
                  +998 93 765-43-21
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* Centered Item Card Preview */}
          <div className="mt-12 flex justify-center w-full relative z-10">
            <AnimatePresence mode="wait">
              {step >= 1 && (
                <motion.div 
                  key="kbd-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-[280px] bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-xl flex items-center gap-3 relative"
                >
                  {/* Lock Indicator in step 1 and 2 */}
                  {step <= 2 && (
                    <div className="absolute top-2 right-2 bg-slate-900/60 p-1.5 rounded-full border border-border/30 backdrop-blur-sm z-20">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}

                  {/* Unlock Indicator starting step 3 */}
                  {step >= 3 && (
                    <div className="absolute top-2 right-2 bg-emerald-500/20 p-1.5 rounded-full border border-emerald-500/30 backdrop-blur-sm z-20">
                      <Unlock className="w-3 h-3 text-primary animate-pulse" />
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                    ⌨️
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-semibold text-xs text-foreground truncate">Mexanik klaviatura</h6>
                    <p className="text-[10px] text-muted-foreground truncate">Qizil svichli, toza holatda</p>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        step === 1 || step === 2 
                          ? "bg-emerald-500/15 text-emerald-500" 
                          : step === 3 
                            ? "bg-amber-500/15 text-amber-500 animate-pulse" 
                            : "bg-slate-500/15 text-slate-400"
                      }`}>
                        {step === 1 || step === 2 
                          ? "ACTIVE" 
                          : step === 3 
                            ? "RESERVED" 
                            : "GIVEN"
                        }
                      </span>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                        1.2 km uzoqlikda
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
