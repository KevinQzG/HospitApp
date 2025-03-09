// src/components/SpecialtyCard.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function SpecialtyCard({ name, icon: Icon, active = false }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    let coordinates: [number, number] = [-75.5849, 6.1816]; // Default: Medellín

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocalización no soportada"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
        });
      });
      coordinates = [position.coords.longitude, position.coords.latitude];
    } catch (error) {
      console.warn("Usando coordenadas por defecto debido a:", error);
    }

    const queryParams = new URLSearchParams({
      specialties: name,
      coordinates: coordinates.join(","),
      max_distance: "20000",
      page: "1",
      page_size: "21",
    });
    router.push(`/results?${queryParams.toString()}`);
  };

  const _CARD_CLASSES = `
    group p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg 
    flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
    ${active
      ? "bg-blue-500 text-white shadow-xl"
      : "bg-white hover:bg-blue-500 hover:text-white hover:shadow-xl"
    }
  `;

  const _ICON_CLASSES = `
    w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 
    ${active ? "text-white" : "text-blue-500 group-hover:text-white"}
  `;

  return (
    <div className={_CARD_CLASSES} onClick={handleClick}>
      <Icon className={_ICON_CLASSES} />
      <h4 className="text-sm sm:text-base font-medium mt-2 sm:mt-3 text-center">{name}</h4>
    </div>
  );
}