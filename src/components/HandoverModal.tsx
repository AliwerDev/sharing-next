"use client";

import React, { useState, useEffect } from "react";
import { Star, Share2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateRequestStatus, useGetProfile } from "@/api/hooks";
import { toast } from "sonner";

export function HandoverModal({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const updateStatusMutation = useUpdateRequestStatus();
  const { data: profile } = useGetProfile();
  
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger mutation on mount
    if (requestId) {
      updateStatusMutation.mutate({ id: requestId, status: 'COMPLETED' }, {
        onSuccess: () => {
          setIsAnimating(true);
          toast.success("Handover completed! Karma points awarded.");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to complete handover");
        }
      });
    }
  }, [requestId]);

  const karma = profile?.karma_points ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full card-elevation border border-border relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {updateStatusMutation.isPending ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Updating transaction status...</p>
          </div>
        ) : (
          <>
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
              Thank you for sharing with your community. Your generosity has been rewarded.
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
                  style={{ width: `${Math.min((karma / 200) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-left mt-2 text-muted-foreground">
                Current Level: <span className="font-semibold text-foreground">{karma > 150 ? "Eco Hero" : karma > 50 ? "Community Supporter" : "Seed Giver"}</span>
              </p>
            </div>

            <Button
              className="w-full rounded-xl py-6 gap-2 text-base hover-lift tactile-scale"
              variant="outline"
              onClick={onClose}
            >
              <Share2 className="w-5 h-5" /> Share Impact
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
