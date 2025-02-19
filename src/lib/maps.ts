
let isLoaded = false;

// Verify if the API key is available
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing. Please check your environment variables.');
}

export function loadGoogleMaps(): Promise<void> {
  // If already loaded, resolve immediately
  if (window.google?.maps) {
    isLoaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.addEventListener('load', () => {
        if (window.google?.maps) {
          isLoaded = true;
          resolve();
        } else {
          reject(new Error('Google Maps not available after script load'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load Google Maps script'));
      });

      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && !!window.google?.maps;
}
