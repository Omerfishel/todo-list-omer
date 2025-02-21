import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Check, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
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
  const [searchInput, setSearchInput] = useState('');
  const [tempLocation, setTempLocation] = useState<{ address: string; lat: number; lng: number; } | null>(location);

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

        // Add click listener to map
        mapInstance.addListener('click', async (e: google.maps.MapMouseEvent) => {
          const clickedPos = e.latLng;
          if (clickedPos) {
            const geocoder = new google.maps.Geocoder();
            const result = await geocoder.geocode({ location: clickedPos });
            if (result.results[0]) {
              const newLocation = {
                address: result.results[0].formatted_address,
                lat: clickedPos.lat(),
                lng: clickedPos.lng(),
              };
              setTempLocation(newLocation);
              
              // Update marker
              if (marker) {
                marker.setMap(null);
              }
              const newMarker = new google.maps.Marker({
                position: clickedPos,
                map: mapInstance,
                draggable: true,
              });
              setMarker(newMarker);

              // Add drag end listener to new marker
              newMarker.addListener('dragend', async () => {
                const position = newMarker.getPosition();
                if (position) {
                  const geocodeResult = await geocoder.geocode({ location: position });
                  if (geocodeResult.results[0]) {
                    setTempLocation({
                      address: geocodeResult.results[0].formatted_address,
                      lat: position.lat(),
                      lng: position.lng(),
                    });
                  }
                }
              });
            }
          }
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
                setTempLocation({
                  address: result.results[0].formatted_address,
                  lat: position.lat(),
                  lng: position.lng(),
                });
              }
            }
          });

          setMarker(markerInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [isOpen, mapContainer, location]);

  const handleSearch = async () => {
    if (!map || !searchInput.trim()) return;

    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address: searchInput });
      if (result.results[0] && result.results[0].geometry) {
        const { location: position } = result.results[0].geometry;
        
        map.setCenter(position);
        map.setZoom(15);

        if (marker) {
          marker.setMap(null);
        }

        const newMarker = new google.maps.Marker({
          map,
          position,
          draggable: true,
        });

        newMarker.addListener('dragend', async () => {
          const newPosition = newMarker.getPosition();
          if (newPosition) {
            const geocodeResult = await geocoder.geocode({ location: newPosition });
            if (geocodeResult.results[0]) {
              setTempLocation({
                address: geocodeResult.results[0].formatted_address,
                lat: newPosition.lat(),
                lng: newPosition.lng(),
              });
            }
          }
        });

        setMarker(newMarker);
        setTempLocation({
          address: result.results[0].formatted_address,
          lat: position.lat(),
          lng: position.lng(),
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleConfirm = () => {
    if (tempLocation) {
      onLocationChange(tempLocation);
      setIsOpen(false);
    }
  };

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
          <div className="flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a location"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div
            ref={setMapContainer}
            className="w-full h-[400px] rounded-lg overflow-hidden"
          />
          {tempLocation && (
            <p className="text-sm text-gray-500">
              Selected: {tempLocation.address}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!tempLocation}>
            <Check className="h-4 w-4 mr-2" />
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
