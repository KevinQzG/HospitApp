import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates([lng, lat]);
        },
        (err) => {
          setError(err.message);
          setCoordinates([-75.5849, 6.1816]); // Default: Medellín
        }
      );
    } else {
      setError("Geolocation no es soportado por este navegador.");
      setCoordinates([-75.5849, 6.1816]); // Default: Medellín
    }
  }, []);

  return { coordinates, error };
};