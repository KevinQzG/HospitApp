import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [_COORDINATES, _SET_COORDINATES] = useState<[number, number] | null>(null);
  const [_ERROR, _SET_ERROR] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (_POSITION) => {
          const _LAT = _POSITION.coords.latitude;
          const _LNG = _POSITION.coords.longitude;
          _SET_COORDINATES([_LNG, _LAT]);
        },
        (_ERR) => {
          _SET_ERROR(_ERR.message);
          _SET_COORDINATES([-75.5849, 6.1816]); // Default: Medellín
        }
      );
    } else {
      _SET_ERROR("Geolocation no es soportado por este navegador.");
      _SET_COORDINATES([-75.5849, 6.1816]); // Default: Medellín
    }
  }, []);

  return { _COORDINATES, _ERROR };
};