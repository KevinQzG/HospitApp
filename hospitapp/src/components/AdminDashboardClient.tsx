"use client";

import { UserCircle } from "lucide-react";
import SearchFormAdmin, { IpsFilter } from "@/components/SearchFormAdmin";
import IpsListAdmin from "@/components/IpsListAdmin";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";

// Importamos la interfaz IpsResponse desde IpsListAdmin
import { IpsResponse } from "@/components/IpsListAdmin";

interface Props extends SearchFormClientProps {
  towns: string[];
  initialData: IpsResponse[]; // Cambiamos any[] por IpsResponse[]
  totalResults: number;
  currentPage: number;
  pageSize: number;
}

export default function AdminDashboardClient({
  eps,
  specialties,
  towns,
  initialData,
  totalResults,
  currentPage,
  pageSize,
}: Props) {
  const [filters, setFilters] = useState<IpsFilter>({
    eps: [],
    specialties: [],
    town: "",
    name: "",
  });
  const router = useRouter();

  const handleFilterChange = (newFilters: IpsFilter) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    params.set("page", "1");
    if (newFilters.town) params.set("town", newFilters.town);
    if (newFilters.eps.length > 0) params.set("eps", newFilters.eps.join(","));
    if (newFilters.specialties.length > 0)
      params.set("specialties", newFilters.specialties.join(","));
    if (newFilters.name) params.set("name", newFilters.name);
    router.push(`/admin/ips?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#ECF6FF] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto py-10 px-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <UserCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-center text-blue-800 dark:text-white">
            ¡Hola Admin! Gestiona las IPS fácilmente
          </h1>
        </div>

        <SearchFormAdmin
          eps={eps}
          specialties={specialties}
          towns={towns}
          onFilterChange={handleFilterChange}
        />

        <div className="max-w-7xl mx-auto mt-12">
          <IpsListAdmin
            filters={filters}
            initialData={initialData}
            totalResults={totalResults}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}