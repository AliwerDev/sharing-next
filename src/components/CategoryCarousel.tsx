"use client";

import React, { useRef } from "react";
import { Laptop, Shirt, Book, ToyBrick, Home, Music, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCategories } from "@/api/hooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function getCategoryIcon(name: string) {
  const norm = name.toLowerCase();
  if (norm.includes('electronics')) return <Laptop className="w-4 h-4" />;
  if (norm.includes('clothing') || norm.includes('clothes')) return <Shirt className="w-4 h-4" />;
  if (norm.includes('book')) return <Book className="w-4 h-4" />;
  if (norm.includes('toy') || norm.includes('game')) return <ToyBrick className="w-4 h-4" />;
  if (norm.includes('home') || norm.includes('kitchen') || norm.includes('household')) return <Home className="w-4 h-4" />;
  if (norm.includes('sport') || norm.includes('music')) return <Music className="w-4 h-4" />;
  return <HeartHandshake className="w-4 h-4" />;
}

export function CategoryCarousel() {
  const { data: categories = [] } = useGetCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeId = searchParams.get("category_id") || "all";

  const handleCategorySelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("category_id");
    } else {
      params.set("category_id", id);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const allCategories = [{ id: "all", name: "All Items" }, ...categories];

  return (
    <div className="relative group/carousel">
      {/* Scroll Controls (Desktop) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover/carousel:md:block">
        <button 
          onClick={() => scroll("left")}
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-md hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover/carousel:md:block">
        <button 
          onClick={() => scroll("right")}
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-md hover:text-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar gap-3 py-2 px-1 md:px-8 snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allCategories.map((category) => {
          const isActive = activeId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all tactile-scale snap-start shadow-sm border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "glass-effect text-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category.id !== "all" && getCategoryIcon(category.name)}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
