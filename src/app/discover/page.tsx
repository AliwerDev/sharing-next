"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { ItemCard, ItemCardProps } from "@/components/ItemCard";
import { Plus, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetActiveItems } from "@/api/hooks";

export default function DiscoverPage() {
  const { data: items = [], isLoading, error } = useGetActiveItems();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Explore Categories</h2>
          </div>
          <CategoryCarousel />
        </section>

        {/* Feed Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Neighborhood Feed</h1>
            <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full hidden sm:inline-block">
              Showing items within 10km
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Finding nearby items...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-effect rounded-3xl border border-destructive/50">
              <h2 className="text-2xl font-bold mb-2 text-destructive">Oops, something went wrong.</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't load the community feed right now. Please try again later.
              </p>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item: any) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-effect rounded-3xl border-dashed">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">It&apos;s quiet around here...</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                No active items in your neighborhood yet. Be the first to share something and earn your first Karma Points!
              </p>
              <Link href="/share">
                <Button className="rounded-full shadow-lg hover-lift tactile-scale gap-2 px-8 py-6 text-lg">
                  <Plus className="w-5 h-5" /> Be the First to Share
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
