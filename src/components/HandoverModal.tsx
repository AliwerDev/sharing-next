"use client";

import React, { useState, useEffect } from "react";
import { Star, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export function HandoverModal({ onClose }: { onClose: () => void }) {
  const [karma, setKarma] = useState(180);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    setIsAnimating(true);

    // Confetti effect
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10b981", "#fbbf24"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10b981", "#fbbf24"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Increment Karma
    setTimeout(() => {
      setKarma(190);
    }, 1000);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full card-elevation border border-border relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
          <Star className="w-10 h-10 text-secondary" fill="currentColor" />
          {isAnimating && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full animate-bounce">
              +10
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">Handover Complete!</h2>
        <p className="text-muted-foreground mb-8">
          Thank you for sharing with your community. Your generosity has been
          rewarded.
        </p>

        <div className="glass-effect rounded-2xl p-4 mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Your Karma
            </span>
            <div className="text-3xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-1000">
              {karma}
            </div>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-secondary transition-all duration-1000 ease-out"
              style={{ width: `${(karma / 200) * 100}%` }}
            />
          </div>
          <p className="text-xs text-left mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">10 points</span> left
            to unlock 'Eco Hero' badge!
          </p>
        </div>

        <Button
          className="w-full rounded-xl py-6 gap-2 text-base hover-lift tactile-scale"
          variant="outline"
        >
          <Share2 className="w-5 h-5" /> Share Impact
        </Button>
      </div>
    </div>
  );
}
