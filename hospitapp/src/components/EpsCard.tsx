"use client";

import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  displayName: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function EpsCard({ name, displayName, icon: Icon, active = false }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    let coordinates: [number, number] = [-75.5849, 6.1816]; // Default: Medellín

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocalización no soportada"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
          });
        }
      );
      coordinates = [position.coords.longitude, position.coords.latitude];
    } catch (error) {
      console.warn("Usando coordenadas por defecto debido a:", error);
    }

    const queryParams = new URLSearchParams({
      epsNames: name,
      coordinates: coordinates.join(","),
      "max_distance": "20000",
      page: "1",
      "page_size": "21",
    });
    router.push(`/results?${queryParams.toString()}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg 
        flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${active
          ? "bg-blue-600 text-white shadow-xl"
          : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white"
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <Icon
        className={`
          w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 
          ${active
            ? "text-white"
            : "text-blue-600 dark:text-blue-400 group-hover:text-white"
          }
        `}
      />
      <h3 className="text-sm sm:text-base font-medium mt-2 sm:mt-3 text-center">
        {displayName}
      </h3>
    </div>
  );
}