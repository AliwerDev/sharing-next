"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { loadYandexScript } from "./yandex-maps-loader";

interface ItemLocationMapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export function ItemLocationMap({ latitude, longitude, locationName }: ItemLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let active = true;
    loadYandexScript()
      .then(() => {
        if (active) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load map API", err);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !mapContainerRef.current) return;
    const ymaps = (window as any).ymaps;
    if (!ymaps) return;

    // Instantiate map centered on the coordinates
    const mapInstance = new ymaps.Map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      controls: ["zoomControl"],
    });
    mapRef.current = mapInstance;

    // Create a 1km radius circle centered on coordinates
    // ymaps.Circle: first arg is [center_coordinates, radius_in_meters]
    const privacyCircle = new ymaps.Circle(
      [[latitude, longitude], 1000],
      {
        balloonContent: locationName
          ? `Neighbor area: ${locationName} (Shown within 1 km radius for privacy)`
          : "Approximate location (1 km radius)",
      },
      {
        fillColor: "#10b981", // Emerald/primary theme color
        fillOpacity: 0.15,
        strokeColor: "#10b981",
        strokeOpacity: 0.7,
        strokeWidth: 2,
      }
    );

    mapInstance.geoObjects.add(privacyCircle);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [loading, latitude, longitude, locationName]);

  return (
    <div className="glass-effect rounded-3xl p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary shrink-0 animate-bounce" />
        <div>
          <h3 className="font-semibold text-base">Approximate Location</h3>
          <p className="text-xs text-muted-foreground">
            {locationName || "Neighbor's Neighborhood"} (Shown within 1 km radius to protect user privacy)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 w-full flex flex-col items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Loading map area...</p>
        </div>
      ) : (
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-border">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
