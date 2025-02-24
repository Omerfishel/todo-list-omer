let isLoaded = false;
let loadPromise: Promise<void> | null = null;

// Verify if the API key is available
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is missing. Please check your environment variables.');
}

export function loadGoogleMaps(): Promise<void> {
  // If already loaded, resolve immediately
  if (window.google?.maps) {
    isLoaded = true;
    return Promise.resolve();
  }

  // If loading is in progress, return existing promise
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      const handleLoad = () => {
        if (window.google?.maps) {
          isLoaded = true;
          loadPromise = null;
          resolve();
        } else {
          const error = new Error('Google Maps not available after script load');
          loadPromise = null;
          reject(error);
        }
      };

      const handleError = () => {
        const error = new Error('Failed to load Google Maps script');
        loadPromise = null;
        reject(error);
      };

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);

      // Only add the script if it doesn't exist
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        document.head.appendChild(script);
      }
    } catch (error) {
      loadPromise = null;
      reject(error);
    }
  });

  return loadPromise;
}

export function isGoogleMapsLoaded(): boolean {
  return isLoaded && !!window.google?.maps;
}
