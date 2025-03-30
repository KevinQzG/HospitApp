"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Hospital } from "lucide-react";

interface IpsResponse {
  _id: string;
  name: string;
  address: string;
  town?: string;
}

const PAGE_SIZE = 10;

const IpsListAdmin = () => {
  const [ipsList, setIpsList] = useState<IpsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchFilteredIps = async () => {
      try {
        setLoading(true);
        setError(null);

        const specialties = searchParams.get("specialties")?.split(",") || [];
        const epsNames = searchParams.get("eps")?.split(",") || [];

        const requestBody = {
          coordinates: [-75.5849, 6.1816],
          "max_distance": 20000,
          page: 1,
          "page_size": 9999,
          specialties,
          "eps_names": epsNames,
        };

        const res = await fetch("/api/search_ips/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        const ips = data.data || [];

        const sortedIps = [...ips].sort((a, b) => {
          const townA = a.town || "Sin municipio";
          const townB = b.town || "Sin municipio";
          return townA.localeCompare(townB);
        });

        setIpsList(sortedIps);
        setTotalResults(sortedIps.length);
      } catch {
        setError("No se pudieron cargar las IPS. Verifica la conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredIps();
  }, [searchParams]);

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = currentPage * PAGE_SIZE;
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, totalResults);

  const townsWithIps: Record<string, IpsResponse[]> = {};
  ipsList.forEach((ips) => {
    const town = ips.town || "Sin municipio";
    townsWithIps[town] = townsWithIps[town] || [];
    townsWithIps[town].push(ips);
  });

  const flatGroupedIps = Object.entries(townsWithIps).flatMap(([town, ips]) =>
    ips.map((ip) => ({ ...ip, town }))
  );

  const paginatedIps = flatGroupedIps.slice(startIndex, endIndex);

  const groupedPaginatedIps = paginatedIps.reduce(
    (acc: Record<string, IpsResponse[]>, ips) => {
      const town = ips.town || "Sin municipio";
      acc[town] = acc[town] || [];
      acc[town].push(ips);
      return acc;
    },
    {}
  );

  const maxVisiblePages = 5;
  const pageRange = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 space-y-12">
      {Object.entries(groupedPaginatedIps).map(([town, ips]) => (
        <div key={town} className="space-y-4">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gray-500" />
            {town}
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium">
                    Dirección
                  </th>
                  <th className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ips.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Hospital className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.address}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => router.push(`/admin/ips/${item._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ease-in-out"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {showingFrom} – {showingTo} de {totalResults} resultados
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {startPage > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  1
                </button>
                {startPage > 2 && <span className="text-gray-400 px-2">…</span>}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="text-gray-400 px-2">…</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IpsListAdmin;