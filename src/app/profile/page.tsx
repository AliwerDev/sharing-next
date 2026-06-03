"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { Star, MapPin, Award, Gift, HandHeart, Calendar, Lock, User as UserIcon, Phone, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProfile, useUpdateProfile, useGetMyItems, useGetMyRequests, useUploadImage } from "@/api/hooks";
import { toast } from "sonner";
import { YandexMapModal } from "@/components/YandexMapModal";

function getImageUrl(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
  if (url.startsWith('/uploads')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${backendUrl}${url}`;
  }
  return url;
}

function ProfileContent() {
  // Queries
  const { data: profile, isLoading: isProfileLoading } = useGetProfile();
  const { data: myShares = [] } = useGetMyItems();
  const { data: myRequests = [] } = useGetMyRequests();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const uploadImageMutation = useUploadImage();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone_number || "");
      setLocation(profile.location || "");
      setLatitude(profile.latitude || undefined);
      setLongitude(profile.longitude || undefined);
    }
  }, [profile]);

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const karma = profile?.karma_points || 0;
  const sharedCount = myShares.length;
  const receivedCount = myRequests.filter((r) => r.status === "COMPLETED").length;
  const activeRequestsCount = myRequests.filter((r) => r.status === "PENDING" || r.status === "APPROVED").length;

  const achievements = [
    { id: 1, title: "First Gift", icon: <Gift className="w-8 h-8" />, unlocked: sharedCount >= 1 || profile?.badges?.includes("First Gift"), color: "text-emerald-500" },
    { id: 2, title: "Category Expert", icon: <Award className="w-8 h-8" />, unlocked: sharedCount >= 3 || profile?.badges?.includes("Category Expert"), color: "text-blue-500" },
    { id: 3, title: "Neighbor of the Month", icon: <Star className="w-8 h-8" />, unlocked: karma > 100 || profile?.badges?.includes("Neighbor of the Month"), color: "text-amber-500" },
    { id: 4, title: "Eco Hero", icon: <HandHeart className="w-8 h-8" />, unlocked: karma > 150 || profile?.badges?.includes("Eco Hero"), color: "text-primary" },
    { id: 5, title: "100 Karma Club", icon: <Award className="w-8 h-8" />, unlocked: karma >= 100 || profile?.badges?.includes("100 Karma Club"), color: "text-purple-500" },
  ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImageMutation.mutateAsync(file);
      await updateProfileMutation.mutateAsync({
        avatar_url: res.url,
      });
      toast.success("Profile avatar updated!");
    } catch (err: any) {
      toast.error("Failed to upload avatar image.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        phone_number: phone,
        location: location,
        latitude,
        longitude,
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Header & Avatar */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl bg-muted flex items-center justify-center relative">
              <img src={getImageUrl(profile?.avatar_url)} alt={profile?.full_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              id="avatar-input" 
              onChange={handleAvatarUpload}
              disabled={uploadImageMutation.isPending}
            />
            <label htmlFor="avatar-input" className="absolute inset-0 cursor-pointer rounded-full" />
            <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 font-bold border-2 border-background z-10">
              <Star className="w-4 h-4" /> {karma}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl font-bold mb-2">{profile?.full_name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" /> {profile?.location || "No location set"}
              </div>
              <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" /> Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "recently"}
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
                  <div className="text-3xl font-black bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-1">{karma}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Karma Points</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-primary mb-1">{sharedCount}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Items Shared</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-blue-500 mb-1">{receivedCount}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Items Received</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center hover-lift transition-all">
                  <div className="text-3xl font-black text-foreground mb-1">{activeRequestsCount}</div>
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
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      required
                    />
                  </div>
                </div>

                 <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMapModal(true)}
                    className="w-full mt-2 py-4 rounded-xl border-dashed border-primary/40 hover:border-primary text-primary flex items-center justify-center gap-2 text-xs font-semibold"
                  >
                    <MapPin className="w-4 h-4" />
                    {latitude && longitude ? "Change location on Map" : "Select location on Map"}
                  </Button>
                </div>

                <div className="space-y-2 pt-2 border-t border-border mt-4">
                  <label className="block text-sm font-medium text-muted-foreground">Change Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="password" 
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      disabled
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full mt-6 rounded-xl hover-lift tactile-scale"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {showMapModal && (
        <YandexMapModal
          initialLat={latitude}
          initialLng={longitude}
          initialAddress={location}
          onClose={() => setShowMapModal(false)}
          onSelect={(lat, lng, addr) => {
            setLatitude(lat);
            setLongitude(lng);
            setLocation(addr);
          }}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
