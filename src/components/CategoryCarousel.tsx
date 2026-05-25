"use client";

import React, { useRef, useState } from "react";
import { Laptop, Shirt, Book, ToyBrick, Home, Music, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Items", icon: null },
  { id: "electronics", name: "Electronics", icon: <Laptop className="w-4 h-4" /> },
  { id: "clothes", name: "Clothes", icon: <Shirt className="w-4 h-4" /> },
  { id: "books", name: "Books", icon: <Book className="w-4 h-4" /> },
  { id: "toys", name: "Toys", icon: <ToyBrick className="w-4 h-4" /> },
  { id: "household", name: "Household", icon: <Home className="w-4 h-4" /> },
  { id: "music", name: "Music", icon: <Music className="w-4 h-4" /> },
];

export function CategoryCarousel() {
  const [activeId, setActiveId] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        {CATEGORIES.map((category) => {
          const isActive = activeId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveId(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all tactile-scale snap-start shadow-sm border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "glass-effect text-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
