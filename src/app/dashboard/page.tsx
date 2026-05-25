"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Star, MapPin, Check, X, Bell, Package, ChevronRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandoverModal } from "@/components/HandoverModal";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"shares" | "requests">("shares");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  // Mock data
  const myShares = [
    {
      id: "s1",
      title: "Ceramic Plant Pots",
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
      applicants: [
        { id: "a1", name: "Elena R.", location: "Downtown", karma: 85, date: "2 hours ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", status: "PENDING" },
        { id: "a2", name: "Mark T.", location: "Block 2", karma: 12, date: "5 hours ago", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80", status: "PENDING" },
      ]
    },
    {
      id: "s2",
      title: "Vintage Fuji Bicycle",
      status: "RESERVED",
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80",
      applicants: [
        { id: "a3", name: "Sam K.", location: "Westside", karma: 150, date: "1 day ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", status: "ACCEPTED" },
      ]
    }
  ];

  const activeListing = myShares.find(s => s.id === selectedListing);

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic to accept
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic to decline
  };

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

          {activeTab === "shares" && (
            <div className="grid sm:grid-cols-2 gap-6">
              {myShares.map(item => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedListing(item.id)}
                  className={`glass-effect rounded-2xl p-4 cursor-pointer hover-lift transition-all ${
                    selectedListing === item.id ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                        {item.status === "ACTIVE" && item.applicants.length > 0 && (
                          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Bell className="w-3 h-3" /> {item.applicants.length}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full self-start mt-1 ${
                        item.status === "ACTIVE" ? "bg-status-active-bg text-status-active" : "bg-status-reserved-bg text-status-reserved"
                      }`}>
                        {item.status}
                      </span>
                      <div className="mt-auto pt-2 flex items-center text-xs text-muted-foreground font-medium">
                        View Applicants <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="glass-effect rounded-2xl p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>You haven't requested any items recently.</p>
            </div>
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
                Requests for "{activeListing.title}"
              </h2>

              <div className="space-y-4">
                {activeListing.applicants.map(app => (
                  <div key={app.id} className="bg-background rounded-2xl p-4 border border-border shadow-sm">
                    <div className="flex gap-3 items-center mb-3">
                      <img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{app.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {app.location} • {app.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full text-xs font-bold">
                        <Star className="w-3 h-3 text-secondary" /> {app.karma}
                      </div>
                    </div>

                    {app.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handleDecline}
                          className="flex-1 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/50"
                        >
                          <X className="w-4 h-4 mr-1" /> Decline
                        </Button>
                        <Button 
                          onClick={handleAccept}
                          className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 mr-1" /> Request Accepted
                        </div>
                        <Button 
                          onClick={() => setShowHandoverModal(true)}
                          className="w-full rounded-xl py-6 text-white shadow-lg hover-lift"
                          style={{ background: "var(--karma-gradient)" }}
                        >
                          <Handshake className="w-5 h-5 mr-2" /> Complete Handover
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

      </main>

      {/* Render the Screen 6 Handover Modal conditionally */}
      {showHandoverModal && <HandoverModal onClose={() => setShowHandoverModal(false)} />}
    </div>
  );
}
