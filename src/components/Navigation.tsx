import React from "react";
import Link from "next/link";
import { Leaf, Search, MapPin, Bell, User as UserIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link href="/discover" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">ShareFlow</span>
        </Link>

        {/* Global Search & Location (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full h-10 pl-10 pr-4 rounded-full bg-input-background border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full glass-effect hover-lift cursor-pointer text-muted-foreground hover:text-foreground shrink-0">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>Downtown, Block 4</span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <Link href="/share">
            <Button className="rounded-full shadow-md hover-lift tactile-scale gap-2 hidden sm:flex">
              <Plus className="w-4 h-4" /> Share Item
            </Button>
          </Link>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent transition-colors relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
          </button>
          
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 hover:border-primary transition-colors cursor-pointer">
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                 <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 flex items-center gap-2">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 pl-10 pr-4 rounded-full bg-input-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full glass-effect text-secondary shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
      </div>
    </header>
  );
}
