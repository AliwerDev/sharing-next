"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ChevronLeft, Flag, Star, MapPin, CheckCircle2, Phone, Heart, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReportModal } from "@/components/ReportModal";
import { useGetItemById, useGetProfile, useGetMyRequests, useCreateRequest } from "@/api/hooks";
import { toast } from "sonner";

function getImageUrl(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80";
  if (url.startsWith('/uploads')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${backendUrl}${url}`;
  }
  return url;
}

export default function ItemViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  // Queries
  const { data: item, isLoading: isItemLoading, error: itemError } = useGetItemById(id);
  const { data: profile } = useGetProfile();
  const { data: myRequests = [], isLoading: isRequestsLoading } = useGetMyRequests();

  // Mutations
  const createRequestMutation = useCreateRequest();

  if (isItemLoading || isRequestsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Item not found</h2>
          <p className="text-muted-foreground mb-8">The listing you are looking for might have been deleted or does not exist.</p>
          <Link href="/discover">
            <Button className="rounded-xl">Back to Feed</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = profile?.id === item.user_id;

  // Find if this user has already requested this item
  const existingRequest = myRequests.find((req) => req.item_id === item.id);
  const requestStatus = existingRequest ? existingRequest.status : "NONE";

  const handleRequestItem = async () => {
    try {
      await createRequestMutation.mutateAsync({ item_id: item.id });
      toast.success("Request Sent!", {
        description: "Your request has been sent to the owner. You'll see their phone number once they approve."
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to request item. Please try again.");
    }
  };

  // Resolve images
  const images = item.images && item.images.length > 0
    ? item.images.map((img) => getImageUrl(img.image_url))
    : ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80"];

  // Determine owner karma tier badge text
  const ownerKarma = item.user?.karma_points || 0;
  let ownerTier = "Seed Giver";
  if (ownerKarma > 150) ownerTier = "Eco Hero";
  else if (ownerKarma > 50) ownerTier = "Community Supporter";

  // Check if we can display giver's phone number
  // It is unveiled if the request is APPROVED or COMPLETED
  const unveiledPhone = (requestStatus === "APPROVED" || requestStatus === "COMPLETED")
    ? existingRequest?.item?.user?.phone_number || "+998 90 123 4567"
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Back Button & Top Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/discover" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ChevronLeft className="w-5 h-5" /> Back to Feed
          </Link>
          {!isOwner && (
            <button 
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Flag className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-lg">
              <img 
                src={images[activeImageIndex]} 
                alt={item.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Image Navigation Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 glass-effect px-3 py-1.5 rounded-full">
                  {images.map((_, idx) => (
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
              <span className="text-sm text-muted-foreground">
                {item.created_at ? `Listed ${new Date(item.created_at).toLocaleDateString()}` : "Recently listed"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
            
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8 whitespace-pre-line">
              {item.description}
            </div>

            {/* Giver Credibility Card */}
            <div className="glass-effect rounded-2xl p-5 mb-8 card-elevation">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-md relative z-10 bg-muted flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
                      alt={item.user?.full_name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {/* Pseudo Radial Tracker for Karma */}
                  <div className="absolute -inset-1 rounded-full border-2 border-secondary/30 z-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-secondary" strokeDasharray="213" strokeDashoffset="40" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.user?.full_name || "Neighbor"}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-4 h-4" /> {item.user?.location || "Nearby"}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-secondary/15 text-secondary-foreground px-3 py-1.5 rounded-full mb-1">
                    <Star className="w-4 h-4 text-secondary" />
                    <span className="font-bold">{ownerKarma}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{ownerTier}</span>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer (Mobile) / Normal Flow (Desktop) */}
            <div className="mt-auto fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border md:static md:p-0 md:bg-transparent md:border-t-0 md:backdrop-blur-none z-40">
              
              {isOwner ? (
                <Link href="/dashboard" className="w-full">
                  <Button 
                    className="w-full py-7 text-lg rounded-2xl shadow-xl hover-lift tactile-scale gap-2 bg-primary"
                  >
                    Manage This Listing (Dashboard) <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  {requestStatus === "NONE" && (
                    <Button 
                      onClick={handleRequestItem}
                      disabled={createRequestMutation.isPending || item.status !== "ACTIVE"}
                      className="w-full py-7 text-lg rounded-2xl shadow-xl hover-lift tactile-scale gap-2"
                    >
                      {createRequestMutation.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Heart className="w-6 h-6" />
                      )}
                      {item.status !== "ACTIVE" ? "Listing is not Active" : "Request This Item"}
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

                  {requestStatus === "REJECTED" && (
                    <Button 
                      disabled
                      variant="outline"
                      className="w-full py-7 text-lg rounded-2xl border-destructive/50 bg-destructive/5 text-destructive opacity-100 gap-2 cursor-default"
                    >
                      Request Politely Declined
                    </Button>
                  )}

                  {requestStatus === "COMPLETED" && (
                    <Button 
                      disabled
                      variant="outline"
                      className="w-full py-7 text-lg rounded-2xl border-muted bg-muted/30 text-muted-foreground opacity-100 gap-2 cursor-default"
                    >
                      <CheckCircle2 className="w-6 h-6" /> Handover Completed
                    </Button>
                  )}

                  {unveiledPhone && (
                    <a href={`tel:${unveiledPhone}`} className="w-full mt-3 block">
                      <Button 
                        className="w-full py-7 text-lg rounded-2xl shadow-xl hover-lift tactile-scale gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        <Phone className="w-6 h-6" /> Call Giver ({unveiledPhone})
                      </Button>
                    </a>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      {showReportModal && (
        <ReportModal 
          itemId={item.id} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}
