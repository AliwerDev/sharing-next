"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { loadYandexScript } from "./yandex-maps-loader";

interface YandexMapModalProps {
  onClose: () => void;
  onSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

export function YandexMapModal({
  onClose,
  onSelect,
  initialLat,
  initialLng,
  initialAddress = "",
}: YandexMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(initialAddress);
  const [coords, setCoords] = useState<[number, number]>([
    initialLat || 41.3111, // Tashkent center latitude
    initialLng || 69.2797, // Tashkent center longitude
  ]);

  const mapRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);

  // Load script and handle geolocation request on mount if no initial coordinates
  useEffect(() => {
    let active = true;

    const init = async () => {
      // If no initial coordinates, check browser geolocation
      if (!initialLat || !initialLng) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (active) {
                setCoords([pos.coords.latitude, pos.coords.longitude]);
              }
            },
            () => {
              // Geolocation blocked or failed, use Tashkent default
            }
          );
        }
      }

      try {
        await loadYandexScript();
        if (active) {
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          toast.error("Failed to load map. Please try again later.");
          onClose();
        }
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [initialLat, initialLng, onClose]);

  // Handle map instantiation once script is loaded
  useEffect(() => {
    if (loading || !mapContainerRef.current) return;
    const ymaps = (window as any).ymaps;
    if (!ymaps) return;

    // Instantiate map
    const mapInstance = new ymaps.Map(mapContainerRef.current, {
      center: coords,
      zoom: 14,
      controls: ["zoomControl", "geolocationControl"],
    });
    mapRef.current = mapInstance;

    // Create a draggable placemark
    const placemarkInstance = new ymaps.Placemark(
      coords,
      {
        balloonContent: "Drag me to your neighborhood!",
      },
      {
        preset: "islands#emeraldDotIconWithCaption",
        draggable: true,
      }
    );
    placemarkRef.current = placemarkInstance;
    mapInstance.geoObjects.add(placemarkInstance);

    // Initial geocode if address is empty
    if (!address) {
      geocodeLocation(coords);
    }

    const updatePosition = (newCoords: [number, number]) => {
      setCoords(newCoords);
      geocodeLocation(newCoords);
    };

    // Event listeners
    placemarkInstance.events.add("dragend", () => {
      const draggedCoords = placemarkInstance.geometry.getCoordinates() as [number, number];
      updatePosition(draggedCoords);
    });

    mapInstance.events.add("click", (e: any) => {
      const clickCoords = e.get("coords") as [number, number];
      placemarkInstance.geometry.setCoordinates(clickCoords);
      updatePosition(clickCoords);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [loading]);

  const geocodeLocation = async (targetCoords: [number, number]) => {
    const ymaps = (window as any).ymaps;
    if (!ymaps) return;
    try {
      const response = await ymaps.geocode(targetCoords);
      const firstGeoObject = response.geoObjects.get(0);
      if (firstGeoObject) {
        const fullAddress = firstGeoObject.getAddressLine();
        // Extract local address parts if possible or keep full address
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
  };

  const handleConfirm = () => {
    onSelect(coords[0], coords[1], address);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-6 md:p-8 max-w-2xl w-full card-elevation border border-border relative flex flex-col gap-4 max-h-[90vh]">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Choose your Location</h2>
            <p className="text-xs text-muted-foreground">
              Drag the green marker or click on the map to set coordinates.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-[350px] md:h-[400px] w-full flex flex-col items-center justify-center bg-muted/20 rounded-2xl border border-border border-dashed">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Initializing Yandex Maps...</p>
          </div>
        ) : (
          <div className="relative w-full rounded-2xl overflow-hidden border border-border h-[350px] md:h-[400px]">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Neighborhood / Address details
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Chilanzar Block 3, Tashkent"
            className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl py-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-xl py-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-medium"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
}
