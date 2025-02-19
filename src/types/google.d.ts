/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
    googleMapsLoaded: boolean;
    initMap: () => void;
  }
} 