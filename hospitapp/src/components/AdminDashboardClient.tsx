"use client";

import { UserCircle } from "lucide-react";
import SearchFormAdmin, { IpsFilter } from "@/components/SearchFormAdmin";
import IpsListAdmin from "@/components/IpsListAdmin";
import { useState } from "react";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";

interface IpsData {
  id: string;
  name: string;
  town?: string;
  // Add other properties you expect from your IPS data
  [key: string]: unknown; // This allows for additional properties while maintaining type safety
}

interface Props extends SearchFormClientProps {
  towns: string[];
  initialData: IpsData[];
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
          onFilterChange={setFilters}
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