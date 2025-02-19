let isLoading = false;
let isLoaded = false;

export function loadGoogleMaps(): Promise<void> {
  if (isLoaded) return Promise.resolve();
  if (isLoading) return new Promise((resolve) => {
    const checkLoaded = setInterval(() => {
      if (isLoaded) {
        clearInterval(checkLoaded);
        resolve();
      }
    }, 100);
  });

  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      };

      script.onerror = () => {
        isLoading = false;
        reject(new Error('Failed to load Google Maps'));
      };

      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      reject(error);
    }
  });
} 