import React from "react";
import { AuthCard } from "@/components/AuthCard";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground mb-8 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to the community</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Share locally. <br/>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              Earn Karma.
            </span> <br/>
            Reduce waste.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed">
            Join the gamified peer-to-peer ecosystem where giving away things you no longer need rewards you with community prestige.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl glass-effect hover-lift">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Give items a second life and reduce local waste.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl glass-effect hover-lift">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Earn Karma</h3>
                <p className="text-sm text-muted-foreground">Get rewarded for your altruism with profile badges.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl glass-effect hover-lift sm:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hyper-Local Trust</h3>
                <p className="text-sm text-muted-foreground">Connect with neighbors securely. Privacy first until handovers are approved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="w-full md:w-[480px] lg:w-[540px] flex flex-col justify-center p-6 md:p-12 relative z-10 bg-card/30 backdrop-blur-sm border-l border-border/50">
        <AuthCard />
      </div>

    </div>
  );
}
