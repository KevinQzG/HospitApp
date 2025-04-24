"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchFormClientProps } from "@/services/cachers/data_caching.service";
import { SearchableSelect } from "@/components/searchable_select";
import { DistanceSelect } from "./DistanceSelect";

export type SearchFormSubmitHandler = (isSubmitting: boolean) => void;

export default function SearchFormClient({
  specialties,
  eps,
  onSubmit,
}: SearchFormClientProps & { onSubmit?: SearchFormSubmitHandler }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialSpecialties, setInitialSpecialties] = useState<string[]>(
    searchParams.get("specialties")?.split(",").filter(Boolean) || []
  );
  const [initialEps, setInitialEps] = useState<string[]>(
    searchParams.get("eps")?.split(",").filter(Boolean) || []
  );
  const [selectedDistance, setSelectedDistance] = useState<string>("");

  useEffect(() => {
    const newSpecialties =
      searchParams.get("specialties")?.split(",").filter(Boolean) || [];
    const newEps = searchParams.get("eps")?.split(",").filter(Boolean) || [];
    setInitialSpecialties(newSpecialties);
    setInitialEps(newEps);
  }, [searchParams]);

  const formatEpsName = (name: string): string => {
    let formattedName = name
      .replace(/\bCrus Blanca\b/i, "Cruz Blanca")
      .replace(/-(S|C)$/i, "") // Remove -S or -C suffix
      .trim()
      .toUpperCase();
    return formattedName;
  };

  const formattedEps = eps.map((epsItem) => ({
    _id: epsItem._id,
    name: formatEpsName(epsItem.name), // Normalize EPS name
    displayName: epsItem.name, // Keep original for display
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (onSubmit) onSubmit(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      let coordinates: [number, number] = [-75.5849, 6.1816];
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error("Geolocalización no soportada"));
              return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );
        coordinates = [position.coords.longitude, position.coords.latitude];
      } catch (error) {
        console.warn("No se pudo obtener la ubicación del usuario:", error);
      }

      const maxDistance =
        pathname === "/results" && selectedDistance ? selectedDistance : "20000";

      const specialties = JSON.parse(
        (formData.get("specialties") as string) || "[]"
      );
      let eps = JSON.parse((formData.get("eps") as string) || "[]");

      // Normalize EPS names
      eps = eps.map((name: string) => formatEpsName(name));
      console.log("Normalized EPS names:", eps);

      // Validate EPS selections
      if (!eps || !Array.isArray(eps) || eps.length === 0) {
        console.warn("No EPS selected, sending empty eps_names array");
        eps = [];
      }

      const page = "1";
      const pageSize = "21";

      const requestBody = {
        coordinates,
        max_distance: parseInt(maxDistance),
        specialties,
        eps_names: eps,
        page: parseInt(page),
        page_size: parseInt(pageSize),
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const apiUrl = "/api/search_ips/filter/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error("Server response:", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(
          `Error al buscar IPS: ${response.statusText} (Código: ${response.status})`
        );
      }

      const result = await response.json();

      if (!result.success) {
        console.error("Error in server response:", result);
        throw new Error(result.error || "Error desconocido al buscar IPS");
      }

      const queryParams = new URLSearchParams({
        coordinates: coordinates.join(","),
        max_distance: maxDistance,
        specialties: specialties.join(","),
        eps_names: eps.join(","),
        page,
        page_size: pageSize,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/results?${queryParams.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
      if (onSubmit) onSubmit(false);
    }
  };

  return (
    <div id="search-form" className="relative max-w-3xl w-full mx-auto px-6">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6 bg-white dark:bg-gray-900 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="eps"
              className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3"
            >
              EPS
            </label>
            <SearchableSelect
              options={formattedEps}
              placeholder="Selecciona EPS..."
              name="eps"
              initialValues={initialEps}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="specialties"
              className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3"
            >
              Especialidades
            </label>
            <SearchableSelect
              options={specialties}
              placeholder="Selecciona especialidades..."
              name="specialties"
              initialValues={initialSpecialties}
            />
          </div>
        </div>

        {pathname === "/results" && (
          <div className="flex-1">
            <label
              htmlFor="distance"
              className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3"
            >
              Distancia máxima (km)
            </label>
            <DistanceSelect
              name="distance"
              value={selectedDistance}
              onChange={(value) => setSelectedDistance(value)}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-center border border-red-100 dark:border-red-800/40">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-2xl hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-100 ease-in-out ${
            isSubmitting ? "cursor-wait opacity-75" : "cursor-pointer"
          }`}
        >
          {isSubmitting ? "Buscando..." : "Buscar"}
        </button>
      </form>
    </div>
  );
}