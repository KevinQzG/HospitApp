"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
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
    const newSpecialties = searchParams.get("specialties")?.split(",").filter(Boolean) || [];
    const newEps = searchParams.get("eps")?.split(",").filter(Boolean) || [];
    setInitialSpecialties(newSpecialties);
    setInitialEps(newEps);
  }, [searchParams]);

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

      const maxDistance = pathname === "/results" && selectedDistance
        ? selectedDistance
        : "20000";

      const specialties = JSON.parse((formData.get("specialties") as string) || "[]");
      const eps = JSON.parse((formData.get("eps") as string) || "[]");
      const page = "1";
      const pageSize = "21";

      const queryParams = new URLSearchParams({
        coordinates: coordinates.join(","),
        maxDistance: maxDistance,
        specialties: specialties.join(","),
        eps: eps.join(","),
        page,
        pageSize: pageSize,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/results?${queryParams.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
      if (onSubmit) onSubmit(false);
    }
  };

  return (
    <div className="relative max-w-3xl w-full mx-auto px-6">
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-gray-100 space-y-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label htmlFor="eps" className="block text-sm font-medium text-gray-700 mb-2">EPS</label>
            <SearchableSelect
              options={eps}
              placeholder="Selecciona EPS..."
              name="eps"
              initialValues={initialEps}
            />
          </div>

          <div className="flex-1">
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
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
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
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
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-2xl hover:bg-blue-700 transition-all duration-100 ease-in-out ${
            isSubmitting ? "cursor-wait opacity-75" : "cursor-pointer"
          }`}
        >
          {isSubmitting ? "Buscando..." : "Buscar"}
        </button>
      </form>
    </div>
  );
}