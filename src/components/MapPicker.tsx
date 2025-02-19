
import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { loadGoogleMaps, isGoogleMapsLoaded } from '@/lib/maps';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapPickerProps {
  location?: Location | null;
  onLocationChange: (location: Location | null) => void;
}

export function MapPicker({ location, onLocationChange }: MapPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempLocation, setTempLocation] = useState<Location | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const cleanupMap = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current = null;
    }
    if (geocoderRef.current) {
      geocoderRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
  };

  const handleConfirm = () => {
    if (tempLocation) {
      onLocationChange(tempLocation);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempLocation(location);
    setIsOpen(false);
  };

  const updateLocationFromLatLng = (latLng: google.maps.LatLng) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    geocoderRef.current.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setTempLocation({
          address: results[0].formatted_address,
          lat: latLng.lat(),
          lng: latLng.lng(),
        });
      } else {
        setError('Failed to get address for selected location');
      }
    });
  };

  const initMap = async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      if (!isGoogleMapsLoaded()) {
        await loadGoogleMaps();
      }

      const defaultLocation = location || tempLocation || { lat: 40.7128, lng: -74.0060 };
      
      const map = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        zoomControl: true,
      });

      const marker = new google.maps.Marker({
        map,
        position: defaultLocation,
        draggable: true,
      });

      const geocoder = new google.maps.Geocoder();

      mapInstance.current = map;
      markerRef.current = marker;
      geocoderRef.current = geocoder;

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        marker.setPosition(e.latLng);
        updateLocationFromLatLng(e.latLng);
      });

      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          updateLocationFromLatLng(position);
        }
      });

      if (defaultLocation) {
        updateLocationFromLatLng(new google.maps.LatLng(defaultLocation.lat, defaultLocation.lng));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize map');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mapRef.current) {
      setTempLocation(location);
      initMap();
    }
    return cleanupMap;
  }, [isOpen, location]);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Map className="h-4 w-4" />
        {location && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pick Location</DialogTitle>
          </DialogHeader>
          <div className="relative mt-4">
            <div
              ref={mapRef}
              className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-100"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="text-sm font-medium text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50/90">
                <div className="text-center p-4">
                  <p className="text-red-500 mb-2">{error}</p>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={() => initMap()}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
          {tempLocation && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{tempLocation.address}</span>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!tempLocation}>
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {location && (
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location.address}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onLocationChange(null)}
              className="text-red-500 hover:text-red-600"
            >
              Clear
            </Button>
          </div>
          <div className="w-full h-[100px] rounded-md overflow-hidden">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=400x100&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&markers=${location.lat},${location.lng}`}
              alt="Location map"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
