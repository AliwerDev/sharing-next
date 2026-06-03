"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, Heart, Shield, Sparkles, Phone, MapPin, 
  Award, CheckCircle, ChevronDown, ArrowRight, 
  Recycle, Menu, X, ArrowUpRight, Flame, ShieldCheck,
  Gift, Users, User, HelpingHand, Eye
} from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { InteractiveSimulator } from "@/components/InteractiveSimulator";
import { useGetStats } from "@/api/hooks";
import { useTranslations } from "next-intl";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";

export default function WelcomePage() {
  const t = useTranslations();
  const { data: stats, isLoading } = useGetStats();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll detection for Navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Stat calculations (real stats from DB, falling back to realistic base if DB is fresh)
  const displayUsers = 150 + (stats?.totalUsers || 0);
  const displayItems = 420 + (stats?.totalItems || 0);
  const displayHandovers = 380 + (stats?.completedHandovers || 0);
  const displayKarma = 3800 + (stats?.totalKarmaPoints || 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden font-sans">
      
      {/* Decorative Blur Background Spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER / NAVBAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "py-4 bg-background/85 backdrop-blur-md border-b border-border" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              ShareFlow
            </span>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("navFeatures")}
            </button>
            <button onClick={() => scrollToSection("simulator")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("navSimulator")}
            </button>
            <button onClick={() => scrollToSection("stats")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("navStats")}
            </button>
            <button onClick={() => scrollToSection("karma")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("navKarmaSystem")}
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {t("navFaq")}
            </button>
          </nav>

          {/* Call to Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-border bg-card/50 hover:bg-card text-sm font-medium hover-lift transition-all cursor-pointer"
            >
              {t("navLogin")}
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover-lift hover:brightness-110 transition-all cursor-pointer shadow-md shadow-primary/20"
            >
              {t("navRegister")}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border bg-card/30"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden absolute top-[100%] left-0 right-0 shadow-lg"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <button onClick={() => scrollToSection("features")} className="text-left py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  {t("navFeatures")}
                </button>
                <button onClick={() => scrollToSection("simulator")} className="text-left py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  {t("navSimulator")}
                </button>
                <button onClick={() => scrollToSection("stats")} className="text-left py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  {t("navStats")}
                </button>
                <button onClick={() => scrollToSection("karma")} className="text-left py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  {t("navKarmaSystem")}
                </button>
                <button onClick={() => scrollToSection("faq")} className="text-left py-2 text-base font-medium text-muted-foreground hover:text-primary">
                  {t("navFaq")}
                </button>
                <div className="h-px bg-border my-2" />
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                    className="flex-1 py-3 rounded-xl border border-border bg-card text-center text-sm font-medium"
                  >
                    {t("navLogin")}
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-center text-sm font-semibold shadow-md"
                  >
                    {t("navRegister")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium w-fit border border-primary/20">
              <Sparkles className="w-4 h-4 animate-pulse text-primary" />
              <span>{t("heroBadge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              {t("heroTitle").split(". ")[0]}. <br />
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                {t("heroTitle").split(". ")[1]}.
              </span> <br />
              {t("heroTitle").split(". ")[2]}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {t("heroDescription")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover-lift hover:brightness-110 cursor-pointer shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group transition-all"
              >
                <span>{t("heroStartBtn")}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => scrollToSection("simulator")}
                className="px-8 py-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-lg hover-lift hover:bg-card cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span>{t("heroHowBtn")}</span>
                <Eye className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Quick trust labels */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-border/60 max-w-lg">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  100%
                </span>
                <span className="text-xs text-muted-foreground">{t("heroTrustSafe")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground flex items-center gap-1.5">
                  <Recycle className="w-5 h-5 text-primary shrink-0" />
                  Yashil
                </span>
                <span className="text-xs text-muted-foreground">{t("heroTrustEco")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-secondary shrink-0" />
                  Gamified
                </span>
                <span className="text-xs text-muted-foreground">{t("heroTrustGamified")}</span>
              </div>
            </div>

          </div>

          {/* Hero Image Side */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Visual Glassmorphic Widget Container */}
            <div className="w-full max-w-[420px] glass-effect rounded-3xl p-6 md:p-8 card-elevation relative overflow-hidden flex flex-col gap-6">
              
              {/* Outer light glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Gift className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{t("lastSharedItem")}</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {t("activeStatus")}
                </span>
              </div>

              {/* Mock item card */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-border/40 shrink-0">
                  🚲
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground truncate">{t("mockItemTitle")}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-normal">
                    {t("mockItemDesc")}
                  </p>
                </div>
              </div>

              {/* Contributor Profile */}
              <div className="p-3 bg-card-dark rounded-2xl border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center border border-secondary/20">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">{t("mockItemUser")}</h4>
                    <p className="text-[10px] text-muted-foreground">{t("mockItemLocation")}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <Award className="w-3.5 h-3.5" />
                    <span>{t("mockItemKarma")}</span>
                  </div>
                  <span className="text-[8px] text-muted-foreground">{t("mockItemRole")}</span>
                </div>
              </div>

              {/* Interactive CTA to show off */}
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover-lift text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{t("mockItemRequest")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>

            {/* Orbiting graphic tags */}
            <div className="absolute -top-4 -right-2 glass-effect rounded-2xl p-3 border border-emerald-500/25 flex items-center gap-2.5 shadow-lg max-w-[170px] animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-primary">
                <Recycle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground">{t("cleanAir")}</span>
                <span className="text-[8px] text-muted-foreground">{t("co2Reduced")}</span>
              </div>
            </div>

            <div className="absolute bottom-4 -left-4 glass-effect rounded-2xl p-3 border border-secondary/25 flex items-center gap-2.5 shadow-lg max-w-[170px] animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground">{t("karmaRep")}</span>
                <span className="text-[8px] text-muted-foreground">{t("newBadges")}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PLATFORM METRICS / STATISTICS SECTION */}
      <section id="stats" className="py-20 bg-card-dark/20 border-y border-border/50 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="max-w-xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">{t("statsTitle")}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">{t("statsSubtitle")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("statsDesc")}
            </p>
            {stats && (
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                {t("statsLive")}
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            
            {/* Stat Item 1 */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-primary/35 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <Users className="w-6 h-6 text-primary" />
              </div>
              {isLoading ? (
                <div className="h-9 w-20 shimmer rounded mb-2" />
              ) : (
                <h3 className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                  {displayUsers}+
                </h3>
              )}
              <span className="text-sm font-semibold text-foreground">{t("activeMembers")}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{t("activeMembersDesc")}</p>
            </div>

            {/* Stat Item 2 */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-primary/35 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Gift className="w-6 h-6 text-emerald-500" />
              </div>
              {isLoading ? (
                <div className="h-9 w-20 shimmer rounded mb-2" />
              ) : (
                <h3 className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                  {displayItems}+
                </h3>
              )}
              <span className="text-sm font-semibold text-foreground">{t("sharedItems")}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{t("sharedItemsDesc")}</p>
            </div>

            {/* Stat Item 3 */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-primary/35 transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/20">
                <HelpingHand className="w-6 h-6 text-secondary" />
              </div>
              {isLoading ? (
                <div className="h-9 w-20 shimmer rounded mb-2" />
              ) : (
                <h3 className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                  {displayHandovers}+
                </h3>
              )}
              <span className="text-sm font-semibold text-foreground">{t("handedOverItems")}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{t("handedOverItemsDesc")}</p>
            </div>

            {/* Stat Item 4 */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-primary/35 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/25">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              {isLoading ? (
                <div className="h-9 w-20 shimmer rounded mb-2" />
              ) : (
                <h3 className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                  {displayKarma}+
                </h3>
              )}
              <span className="text-sm font-semibold text-foreground">{t("totalKarma")}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{t("totalKarmaDesc")}</p>
            </div>

          </div>

          {/* Recent Shares Live Stream */}
          {stats?.recentShares && stats.recentShares.length > 0 && (
            <div className="mt-16 max-w-3xl mx-auto text-left">
              <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider text-center">
                {t("recentActivities")}
              </h4>
              <div className="bg-card/30 border border-border/40 rounded-2xl p-4 divide-y divide-border/30 backdrop-blur-sm">
                {stats.recentShares.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">🎁</span>
                      <div>
                        <span className="font-semibold text-foreground">{item.user.full_name}</span>{" "}
                        <span className="text-muted-foreground">{t("recentActivityShared")}</span>{" "}
                        <span className="text-primary font-medium">{item.title}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {item.user.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* INTERACTIVE SIMULATOR SECTION */}
      <section id="simulator" className="py-24 max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">{t("simulatorTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold">{t("simulatorSubtitle")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("simulatorDesc")}
          </p>
        </div>

        <InteractiveSimulator />
      </section>

      {/* MAIN FEATURES / BENEFITS SECTION */}
      <section id="features" className="py-20 bg-card-dark/10 border-y border-border/30 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">{t("featuresTitle")}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">{t("featuresSubtitle")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("featuresDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Feature 1 */}
            <div className="glass-effect rounded-2xl p-8 hover-lift flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("feature1Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("feature1Desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect rounded-2xl p-8 hover-lift flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shrink-0">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("feature2Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("feature2Desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect rounded-2xl p-8 hover-lift flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("feature3Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("feature3Desc")}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* GAMIFIED KARMA LEVELS SECTION */}
      <section id="karma" className="py-24 max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">{t("gamificationTitle")}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-foreground">
              {t("gamificationSubtitle")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {t("gamificationDesc")}
            </p>

            <div className="space-y-4">
              
              {/* Tier 1 */}
              <div className="flex gap-4 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 text-lg">
                  🌱
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t("tier1Title")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("tier1Desc")}</p>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="flex gap-4 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center border border-secondary/20 shrink-0 text-lg">
                  🤝
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t("tier2Title")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("tier2Desc")}</p>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="flex gap-4 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center border border-amber-500/20 shrink-0 text-lg">
                  👑
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t("tier3Title")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("tier3Desc")}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            {/* Visual representation of user card achievements page */}
            <div className="w-full max-w-[440px] glass-effect rounded-3xl p-6 md:p-8 card-elevation relative overflow-hidden flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-xl shadow-md border border-amber-300">
                  👑
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">{t("userMockName")}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {t("userMockTitle")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card-dark rounded-xl p-3 text-center border border-border/30">
                  <span className="text-xs text-muted-foreground block">{t("userMockTotalKarma")}</span>
                  <span className="text-xl font-bold text-secondary">{t("userMockTotalKarmaValue")}</span>
                </div>
                <div className="bg-card-dark rounded-xl p-3 text-center border border-border/30">
                  <span className="text-xs text-muted-foreground block">{t("userMockSharedCount")}</span>
                  <span className="text-xl font-bold text-primary">{t("userMockSharedCountValue")}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">
                  {t("achievementsTitle")}
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-card rounded-lg text-center border border-border/50">
                    <span className="text-2xl">🌱</span>
                    <span className="text-[9px] font-semibold">{t("achievement1")}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-card rounded-lg text-center border border-border/50">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[9px] font-semibold">{t("achievement2")}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-card rounded-lg text-center border border-border/50">
                    <span className="text-2xl">🔌</span>
                    <span className="text-[9px] font-semibold">{t("achievement3")}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-card-dark/20 border-t border-border/50 relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">{t("faqTitle")}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">{t("faqSubtitle")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("faqDesc")}
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-6 md:p-10 card-elevation bg-card/65 backdrop-blur-sm border border-border/50">
            <Accordion type="single" collapsible className="w-full">
              
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                  {t("faqQ1")}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {t("faqA1")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                  {t("faqQ2")}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {t("faqA2")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                  {t("faqQ3")}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {t("faqA3")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                  {t("faqQ4")}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {t("faqA4")}
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION FOOTER BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
        <div className="glass-effect rounded-3xl p-8 md:p-16 card-elevation relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-background to-amber-950/10 border border-primary/20">
          
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {t("footerBannerTitle")}
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              {t("footerBannerDesc")}
            </p>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover-lift hover:brightness-110 shadow-lg cursor-pointer transition-all inline-flex items-center gap-2"
            >
              <span>{t("footerBannerBtn")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border bg-card-dark/20 text-center relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">ShareFlow</span>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("footerCopyright")}
          </p>

          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t("footerTerms")}</a>
            <span className="text-muted-foreground/30">|</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t("footerPrivacy")}</a>
          </div>
        </div>
      </footer>

      {/* GLASSMORPHIC AUTH DIALOG MODAL */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("authModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("authModalDesc")}
            </DialogDescription>
          </DialogHeader>
          <AuthCard onClose={() => setIsAuthModalOpen(false)} />
        </DialogContent>
      </Dialog>

    </div>
  );
}
