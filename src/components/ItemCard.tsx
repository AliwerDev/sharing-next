import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

export type ItemCardProps = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  distance: string;
  status: "ACTIVE" | "RESERVED" | "GIVEN" | "DELETED";
  owner: {
    name: string;
    karma: number;
    avatarUrl: string;
  };
};

export function ItemCard({
  id,
  title,
  category,
  imageUrl,
  distance,
  status,
  owner,
}: ItemCardProps) {
  let karmaTier = "Seed Giver";
  if (owner.karma > 150) karmaTier = "Eco Hero";
  else if (owner.karma > 50) karmaTier = "Community Supporter";

  return (
    <Link href={`/item/${id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden card-elevation hover-lift h-full flex flex-col">
        <div className="relative aspect-4/3 bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3">
            <StatusBadge status={status} glass />
          </div>

          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-foreground">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{distance} away</span>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-muted overflow-hidden">
                <Image
                  src={owner.avatarUrl}
                  alt={owner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {owner.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  {karmaTier}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-secondary" />
              <span className="text-xs font-bold">{owner.karma}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
