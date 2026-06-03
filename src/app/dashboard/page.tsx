"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Star, MapPin, Check, X, Bell, Package, ChevronRight, Handshake, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandoverModal } from "@/components/HandoverModal";
import { useGetMyItems, useGetMyRequests, useGetIncomingRequests, useUpdateRequestStatus } from "@/api/hooks";
import { toast } from "sonner";
import Link from "next/link";

function getImageUrl(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80";
  if (url.startsWith('/uploads')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${backendUrl}${url}`;
  }
  return url;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"shares" | "requests">("shares");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [selectedHandoverRequest, setSelectedHandoverRequest] = useState<string | null>(null);

  // Queries
  const { data: myShares = [], isLoading: isSharesLoading } = useGetMyItems();
  const { data: myRequests = [], isLoading: isMyRequestsLoading } = useGetMyRequests();
  const { data: incomingRequests = [], isLoading: isIncomingLoading } = useGetIncomingRequests();

  // Mutations
  const updateStatusMutation = useUpdateRequestStatus();

  const handleDecline = async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: requestId, status: "REJECTED" });
      toast.success("Request politely declined.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update request.");
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: requestId, status: "APPROVED" });
      toast.success("Request accepted! Giver contact details are now unveiled to the requester.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept request.");
    }
  };

  const activeListing = myShares.find(s => s.id === selectedListing);
  const activeRequests = incomingRequests.filter(req => req.item_id === selectedListing);

  const isPageLoading = isSharesLoading || isMyRequestsLoading || isIncomingLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab("shares")}
              className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
                activeTab === "shares" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Shares
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
                activeTab === "requests" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Requests
            </button>
          </div>

          {isPageLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            </div>
          ) : activeTab === "shares" ? (
            myShares.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {myShares.map(item => {
                  const itemRequests = incomingRequests.filter(req => req.item_id === item.id);
                  const pendingCount = itemRequests.filter(req => req.status === 'PENDING').length;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedListing(item.id)}
                      className={`glass-effect rounded-2xl p-4 cursor-pointer hover-lift transition-all ${
                        selectedListing === item.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                          <img src={getImageUrl(item.images?.[0]?.image_url)} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                            {pendingCount > 0 && (
                              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Bell className="w-3 h-3" /> {pendingCount}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full self-start mt-1 ${
                            item.status === "ACTIVE" 
                              ? "bg-status-active-bg text-status-active" 
                              : item.status === "RESERVED"
                              ? "bg-status-reserved-bg text-status-reserved"
                              : "bg-status-given-bg text-status-given"
                          }`}>
                            {item.status}
                          </span>
                          <div className="mt-auto pt-2 flex items-center text-xs text-muted-foreground font-medium">
                            View Applicants ({itemRequests.length}) <ChevronRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-effect rounded-2xl p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven&apos;t shared any items yet.</p>
                <Link href="/share" className="inline-block mt-4">
                  <Button className="rounded-xl">Share your first item</Button>
                </Link>
              </div>
            )
          ) : (
            myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map(req => (
                  <div key={req.id} className="glass-effect rounded-2xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        <img src={getImageUrl(req.item?.images?.[0]?.image_url)} alt={req.item?.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{req.item?.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span>Owner: {req.item?.user?.full_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-secondary" /> {req.item?.user?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto ${
                        req.status === "PENDING"
                          ? "bg-status-active-bg text-status-active"
                          : req.status === "APPROVED"
                          ? "bg-status-reserved-bg text-status-reserved"
                          : req.status === "REJECTED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-status-given-bg text-status-given"
                      }`}>
                        {req.status === "APPROVED" ? "APPROVED - Phone Unveiled" : req.status}
                      </span>
                      {(req.status === "APPROVED" || req.status === "COMPLETED") && req.item?.user?.phone_number && (
                        <a href={`tel:${req.item.user.phone_number}`} className="flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-1 block">
                          <Phone className="w-4 h-4" /> {req.item.user.phone_number}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-effect rounded-2xl p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven&apos;t requested any items recently.</p>
                <Link href="/discover" className="inline-block mt-4">
                  <Button className="rounded-xl">Browse items</Button>
                </Link>
              </div>
            )
          )}
        </div>

        {/* Sidebar / Drawer (Expanded View) */}
        <div className={`w-full md:w-96 glass-effect rounded-3xl border border-border p-6 card-elevation h-[calc(100vh-12rem)] sticky top-24 overflow-y-auto ${
          !selectedListing ? "hidden md:flex flex-col items-center justify-center text-center text-muted-foreground" : "block"
        }`}>
          {!selectedListing ? (
            <>
              <Handshake className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a listing to manage incoming requests.</p>
            </>
          ) : activeListing ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-4">
                Requests for &quot;{activeListing.title}&quot;
              </h2>

              <div className="space-y-4">
                {activeRequests.length > 0 ? (
                  activeRequests.map(app => (
                    <div key={app.id} className="bg-background rounded-2xl p-4 border border-border shadow-sm">
                      <div className="flex gap-3 items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt={app.requester?.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-semibold text-sm truncate">{app.requester?.full_name || "Neighbor"}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <MapPin className="w-3 h-3 text-secondary shrink-0" /> {app.requester?.location} • {new Date(app.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 text-secondary" /> {app.requester?.karma_points || 0}
                        </div>
                      </div>

                      {updateStatusMutation.isPending && updateStatusMutation.variables?.id === app.id ? (
                        <div className="flex justify-center py-2">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        </div>
                      ) : app.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecline(app.id);
                            }}
                            className="flex-1 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/50"
                          >
                            <X className="w-4 h-4 mr-1" /> Decline
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(app.id);
                            }}
                            className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </Button>
                        </div>
                      ) : app.status === "APPROVED" ? (
                        <div className="space-y-3">
                          <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center">
                            <Check className="w-4 h-4 mr-1" /> Request Accepted
                          </div>
                          {app.requester?.phone_number && (
                            <div className="text-center text-xs text-muted-foreground font-medium">
                              Requester Phone: <a href={`tel:${app.requester.phone_number}`} className="text-primary hover:underline">{app.requester.phone_number}</a>
                            </div>
                          )}
                          <Button 
                            onClick={() => setSelectedHandoverRequest(app.id)}
                            className="w-full rounded-xl py-6 text-white shadow-lg hover-lift"
                            style={{ background: "var(--karma-gradient)" }}
                          >
                            <Handshake className="w-5 h-5 mr-2" /> Complete Handover
                          </Button>
                        </div>
                      ) : app.status === "COMPLETED" ? (
                        <div className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 mr-1" /> Handover Completed
                        </div>
                      ) : (
                        <div className="bg-destructive/10 text-destructive text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center">
                          Request Declined
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No requests for this listing yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>

      </main>

      {/* Render the Screen 6 Handover Modal conditionally */}
      {selectedHandoverRequest && (
        <HandoverModal 
          requestId={selectedHandoverRequest} 
          onClose={() => setSelectedHandoverRequest(null)} 
        />
      )}
    </div>
  );
}
