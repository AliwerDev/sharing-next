"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Star, MapPin, Award, Gift, HandHeart, Calendar, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const user = {
    name: "Jane Doe",
    location: "Downtown, Block 4",
    phone: "+998 90 123 4567",
    memberSince: "May 2026",
    karma: 180,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    stats: {
      shared: 24,
      received: 12,
      activeRequests: 5
    }
  };

  const achievements = [
    { id: 1, title: "First Gift", icon: <Gift className="w-8 h-8" />, unlocked: true, color: "text-emerald-500" },
    { id: 2, title: "Category Expert", icon: <Award className="w-8 h-8" />, unlocked: true, color: "text-blue-500" },
    { id: 3, title: "Neighbor of the Month", icon: <Star className="w-8 h-8" />, unlocked: true, color: "text-amber-500" },
    { id: 4, title: "Eco Hero", icon: <HandHeart className="w-8 h-8" />, unlocked: false, color: "text-primary" },
    { id: 5, title: "100 Karma Club", icon: <Award className="w-8 h-8" />, unlocked: true, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Header & Avatar */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 font-bold border-2 border-background">
              <Star className="w-4 h-4" /> {user.karma}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" /> {user.location}
              </div>
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" /> Member since {user.memberSince}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Impact Grid & Achievements */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Impact Grid */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Your Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-1">{user.karma}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Karma Points</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-primary mb-1">{user.stats.shared}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Items Shared</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-blue-500 mb-1">{user.stats.received}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Items Received</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-foreground mb-1">{user.stats.activeRequests}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Requests</div>
                </div>
              </div>
            </section>

            {/* Achievements Locker */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Achievements Locker</h2>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`rounded-2xl p-6 text-center border-2 transition-all ${
                      badge.unlocked 
                        ? "bg-card border-border card-elevation hover-lift" 
                        : "bg-muted/50 border-transparent grayscale opacity-60"
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? "bg-background shadow-inner" : "bg-muted"}`}>
                      <div className={badge.unlocked ? badge.color : "text-muted-foreground"}>
                        {badge.icon}
                      </div>
                    </div>
                    <h3 className={`font-semibold text-sm ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                      {badge.title}
                    </h3>
                    {!badge.unlocked && (
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-3xl p-6 border border-border sticky top-24">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      defaultValue={user.phone}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      defaultValue={user.location}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border mt-4">
                  <label className="block text-sm font-medium text-muted-foreground">Change Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="password" 
                      placeholder="New password"
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                  </div>
                </div>

                <Button className="w-full mt-6 rounded-xl hover-lift tactile-scale">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
