"use client";

import { useState } from "react";
import { SearchableSelect } from "@/components/searchable_select";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
import { useRouter } from "next/navigation"; // Importar useRouter

export interface IpsFilter {
  eps: string[];
  specialties: string[];
  town: string;
  name: string;
}

interface Props extends Readonly<SearchFormClientProps> {
  readonly towns: readonly string[];
  readonly onFilterChange: (filters: IpsFilter) => void;
}

export default function SearchFormAdmin({ eps, specialties, towns, onFilterChange }: Props) {
  const [filters, setFilters] = useState<IpsFilter>({
    eps: [],
    specialties: [],
    town: "",
    name: "",
  });

  const router = useRouter(); // Usar el router para actualizar la URL

  const handleApplyFilters = () => {
    // Actualizar el estado en el componente padre
    onFilterChange(filters);

    // Crear los parámetros de la URL con los filtros
    const params = new URLSearchParams();
    if (filters.eps.length > 0) {
      params.set("eps", filters.eps.join(","));
    }
    if (filters.specialties.length > 0) {
      params.set("specialties", filters.specialties.join(","));
    }
    if (filters.town) {
      params.set("town", filters.town);
    }
    if (filters.name) {
      params.set("name", filters.name);
    }

    // Actualizar la URL sin recargar la página
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-10">
      <form
        className="max-w-4xl w-full mx-auto px-6 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleApplyFilters();
        }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">EPS</label>
            <SearchableSelect
              options={eps.map((e) => ({ _id: e._id, name: e.name }))}
              name="eps"
              placeholder="Selecciona EPS..."
              initialValues={[]}
              onChange={(values) => setFilters((prev) => ({ ...prev, eps: values }))}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Especialidades
            </label>
            <SearchableSelect
              options={specialties}
              name="specialties"
              placeholder="Selecciona especialidades..."
              initialValues={[]}
              onChange={(values) =>
                setFilters((prev) => ({ ...prev, specialties: values }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Ciudad / Municipio
            </label>
            <select
              value={filters.town}
              onChange={(e) => setFilters((prev) => ({ ...prev, town: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
            >
              <option value="">Todos los municipios</option>
              {towns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
              Nombre de la IPS
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-all"
          >
            Filtrar
          </button>
        </div>
      </form>
    </div>
  );
}