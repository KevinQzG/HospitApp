"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
import { SearchableSelect } from "./searchable_select";

export default function SearchFormClient({
  specialties,
  eps,
}: SearchFormClientProps) {
  const router = useRouter();
  const [_IS_SUBMITTING, set_is_submitting] = useState(false);
  const [_ERROR, set_error] = useState<string | null>(null);

  const _HANDLE_SUBMIT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_is_submitting(true);
    set_error(null);

    try {
      const _FORM_DATA = new FormData(e.currentTarget);

      let coordinates: [number, number] = [-75.5849, 6.1816]; // Medellín Default Center
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

      const max_distance = "20000"; // Default value of 20 km
      const specialties = JSON.parse(
        (_FORM_DATA.get("specialties") as string) || "[]"
      );
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

      router.push(`/results?${queryParams.toString()}`);
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Submission error:", err);
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <div className="relative max-w-3xl w-full mx-auto px-6">
      <form
        onSubmit={_HANDLE_SUBMIT}
        className=" p-8 rounded-2xl border-gray-100 space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EPS
            </label>
            <SearchableSelect
              options={eps}
              placeholder="Selecciona EPS..."
              name="eps"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades
            </label>
            <SearchableSelect
              options={specialties}
              placeholder="Selecciona especialidades..."
              name="specialties"
            />
          </div>
        </div>

        {_ERROR && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
            <strong>Error:</strong> {_ERROR}
          </div>
        )}

        <button
          type="submit"
          disabled={_IS_SUBMITTING}
          className={`w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out ${
            _IS_SUBMITTING ? "cursor-wait opacity-75" : "cursor-pointer"
          }`}
        >
          {_IS_SUBMITTING ? "Buscando..." : "Buscar"}
        </button>
      </form>
    </div>
  );
}
