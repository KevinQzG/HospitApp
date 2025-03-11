// SearchFormClient.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
import { SearchableSelect } from "./searchable_select";
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
  const [_IS_SUBMITTING, set_is_submitting] = useState(false);
  const [_ERROR, set_error] = useState<string | null>(null);

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

  const _HANDLE_SUBMIT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_is_submitting(true);
    if (onSubmit) onSubmit(true);
    set_error(null);

    try {
      const _FORM_DATA = new FormData(e.currentTarget);

      let coordinates: [number, number] = [-75.5849, 6.1816];
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
        console.warn("No se pudo obtener la ubicación del usuario:", error);
      }

      const max_distance = pathname === "/results" && selectedDistance
        ? selectedDistance
        : "20000";

      const specialties = JSON.parse((_FORM_DATA.get("specialties") as string) || "[]");
      const eps = JSON.parse((_FORM_DATA.get("eps") as string) || "[]");
      const page = "1";
      const page_size = "21";

      const queryParams = new URLSearchParams({
        coordinates: coordinates.join(","),
        max_distance,
        specialties: specialties.join(","),
        eps: eps.join(","),
        page,
        page_size,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/results?${queryParams.toString()}`);
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Submission error:", err);
    } finally {
      set_is_submitting(false);
      if (onSubmit) onSubmit(false);
    }
  };

  return (
    <div className="relative max-w-3xl w-full mx-auto px-6">
      <form onSubmit={_HANDLE_SUBMIT} className="p-8 rounded-2xl border border-gray-100 space-y-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">EPS</label>
            <SearchableSelect
              options={eps}
              placeholder="Selecciona EPS..."
              name="eps"
              initialValues={initialEps}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distancia máxima (km)
            </label>
            <DistanceSelect
              name="distance"
              value={selectedDistance}
              onChange={(value) => setSelectedDistance(value)}
            />
          </div>
        )}

        {_ERROR && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
            <strong>Error:</strong> {_ERROR}
          </div>
        )}

        <button
          type="submit"
          disabled={_IS_SUBMITTING}
          className={`w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-2xl hover:bg-blue-700 transition-all duration-100 ease-in-out ${
            _IS_SUBMITTING ? "cursor-wait opacity-75" : "cursor-pointer"
          }`}
        >
          {_IS_SUBMITTING ? "Buscando..." : "Buscar"}
        </button>
      </form>
    </div>
  );
}