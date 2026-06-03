"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Navigation as NavigationIcon, ChevronLeft, Flag, Star, MapPin, CheckCircle2, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReportModal } from "@/components/ReportModal";

export default function ItemViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [requestStatus, setRequestStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock data
  const item = {
    title: "Vintage Fuji Bicycle",
    description: "Well maintained vintage Fuji bicycle from the 1980s. Has a few scratches on the frame but rides perfectly. I've upgraded to a new road bike and want this to go to someone who will appreciate it and use it for daily commutes.\n\nComes with a bell and a rear rack. Tires were replaced last summer.",
    status: "ACTIVE",
    createdAt: "Listed 2 hours ago",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80"
    ],
    owner: {
      name: "Alex Rivera",
      location: "Downtown, Block 4",
      karma: 120,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      tier: "Community Supporter",
      phone: "+998 90 123 4567" // Unveiled only if approved
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Back Button & Top Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/discover" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ChevronLeft className="w-5 h-5" /> Back to Feed
          </Link>
          <button 
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-lg">
              <img 
                src={item.images[activeImageIndex]} 
                alt={item.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Image Navigation Dots */}
              {item.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 glass-effect px-3 py-1.5 rounded-full">
                  {item.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIndex === idx ? "bg-primary w-4" : "bg-foreground/30 hover:bg-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-status-active-bg text-status-active rounded-full text-xs font-semibold tracking-wide">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                  {item.status}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">{item.createdAt}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
            
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8">
              {item.description.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>

            {/* Giver Credibility Card */}
            <div className="glass-effect rounded-2xl p-5 mb-8 card-elevation">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-md relative z-10">
                    <img src={item.owner.avatarUrl} alt={item.owner.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Pseudo Radial Tracker for Karma */}
                  <div className="absolute -inset-1 rounded-full border-2 border-secondary/30 z-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-secondary" strokeDasharray="213" strokeDashoffset="40" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.owner.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-4 h-4" /> {item.owner.location}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground px-3 py-1.5 rounded-full mb-1">
                    <Star className="w-4 h-4 text-secondary" />
                    <span className="font-bold">{item.owner.karma}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.owner.tier}</span>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer (Mobile) / Normal Flow (Desktop) */}
            <div className="mt-auto fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border md:static md:p-0 md:bg-transparent md:border-t-0 md:backdrop-blur-none z-40">
              
              {requestStatus === "NONE" && (
                <Button 
                  onClick={() => setRequestStatus("PENDING")}
                  className="w-full py-7 text-lg rounded-2xl shadow-xl hover-lift tactile-scale gap-2"
                >
                  <Heart className="w-6 h-6" /> Request This Item
                </Button>
              )}

              {requestStatus === "PENDING" && (
                <Button 
                  disabled
                  variant="outline"
                  className="w-full py-7 text-lg rounded-2xl border-primary/50 bg-primary/5 text-primary opacity-100 gap-2 cursor-default"
                >
                  <CheckCircle2 className="w-6 h-6" /> Request Sent & Pending Review
                </Button>
              )}

              {requestStatus === "APPROVED" && (
                <a href={`tel:${item.owner.phone}`} className="w-full">
                  <Button 
                    className="w-full py-7 text-lg rounded-2xl shadow-xl hover-lift tactile-scale gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <Phone className="w-6 h-6" /> Call Giver ({item.owner.phone})
                  </Button>
                </a>
              )}
              
            </div>

          </div>
        </div>
      </main>

      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
}
