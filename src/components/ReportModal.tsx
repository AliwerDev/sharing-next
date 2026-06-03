"use client";

import React, { useState } from "react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateReport } from "@/api/hooks";

export function ReportModal({ itemId, onClose }: { itemId: string; onClose: () => void }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReportMutation = useCreateReport();

  const REASONS = [
    "Commercial/Not Free",
    "Broken/Hazardous",
    "Inappropriate Behavior/Language",
    "Scam/Spam",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createReportMutation.mutateAsync({
        item_id: itemId,
        reason: `${selectedReason}${notes ? ` - ${notes}` : ""}`,
      });
      setIsSubmitting(false);
      toast.success("Report Submitted", {
        description: "Thank you for helping keep ShareFlow safe. Our moderation team will review this shortly."
      });
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-6 md:p-8 max-w-md w-full card-elevation border border-border relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
             <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Report Listing</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Why are you reporting this?</label>
            <div className="space-y-2">
              {REASONS.map(reason => (
                <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-accent/50 transition-colors">
                  <input 
                    type="radio" 
                    name="report_reason" 
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                    required
                  />
                  <span className="text-sm font-medium">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Additional Notes (Optional)</label>
            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional context..."
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none text-sm"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              False reports are subject to review and may result in penalties to your Karma Points or account suspension.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 rounded-xl py-5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedReason}
              className="flex-1 rounded-xl py-5 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
