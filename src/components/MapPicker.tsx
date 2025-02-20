
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loadGoogleMaps, isGoogleMapsLoaded } from '@/lib/maps';

interface MapPickerProps {
  location: { address: string; lat: number; lng: number; } | null;
  onLocationChange: (location: { address: string; lat: number; lng: number; } | null) => void;
}

export function MapPicker({ location, onLocationChange }: MapPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initMap = async () => {
      try {
        if (!isGoogleMapsLoaded()) {
          await loadGoogleMaps();
        }

        if (!mapContainer) return;

        const mapInstance = new google.maps.Map(mapContainer, {
          center: location ? 
            { lat: location.lat, lng: location.lng } : 
            { lat: 0, lng: 0 },
          zoom: location ? 15 : 2,
        });

        setMap(mapInstance);

        if (location) {
          const markerInstance = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstance,
            draggable: true,
          });

          markerInstance.addListener('dragend', async () => {
            const position = markerInstance.getPosition();
            if (position) {
              const geocoder = new google.maps.Geocoder();
              const result = await geocoder.geocode({ location: position });
              if (result.results[0]) {
                onLocationChange({
                  address: result.results[0].formatted_address,
                  lat: position.lat(),
                  lng: position.lng(),
                });
              }
            }
          });

          setMarker(markerInstance);
        }

        if (searchInput) {
          const searchBoxInstance = new google.maps.places.SearchBox(searchInput);
          mapInstance.controls[google.maps.ControlPosition.TOP_CENTER].push(searchInput);

          searchBoxInstance.addListener('places_changed', () => {
            const places = searchBoxInstance.getPlaces();
            if (!places || places.length === 0) return;

            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            mapInstance.setCenter(place.geometry.location);
            mapInstance.setZoom(15);

            if (marker) {
              marker.setMap(null);
            }

            const newMarker = new google.maps.Marker({
              map: mapInstance,
              position: place.geometry.location,
              draggable: true,
            });

            newMarker.addListener('dragend', async () => {
              const position = newMarker.getPosition();
              if (position) {
                const geocoder = new google.maps.Geocoder();
                const result = await geocoder.geocode({ location: position });
                if (result.results[0]) {
                  onLocationChange({
                    address: result.results[0].formatted_address,
                    lat: position.lat(),
                    lng: position.lng(),
                  });
                }
              }
            });

            setMarker(newMarker);
            onLocationChange({
              address: place.formatted_address || '',
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          });

          setSearchBox(searchBoxInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [isOpen, mapContainer, searchInput, location]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MapPin className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <input
            ref={setSearchInput}
            type="text"
            placeholder="Search for a location"
            className="w-full px-4 py-2 border rounded-md"
          />
          <div
            ref={setMapContainer}
            className="w-full h-[400px] rounded-lg overflow-hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
