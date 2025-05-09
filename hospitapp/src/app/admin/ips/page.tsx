"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Hospital,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { ENV } from "@/config/env";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type IpsResponse = {
  _id: string;
  name: string;
  department: string;
  town: string;
  address: string;
  phone?: string;
  email?: string;
  rating?: number;
  level?: string;
  eps?: { _id: string; name: string }[];
  specialties?: { _id: string; name: string }[];
};

type IpsListResponse = {
  success: boolean;
  error?: string;
  data?: IpsResponse[];
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
};

type AuthResponse = {
  success: boolean;
  user?: { role: string };
  error?: string;
  message?: string;
};

export default function AdminIpsPage() {
  const router = useRouter();
  const [groupedIps, setGroupedIps] = useState<{
    [key: string]: IpsResponse[];
  }>({});
  const [allIps, setAllIps] = useState<IpsResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(21);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [appliedTown, setAppliedTown] = useState("");
  const [towns, setTowns] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch(
          `${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/auth/verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              authenticationNeeded: true,
              authenticationRoles: ["ADMIN"],
            }),
          }
        );

        if (!authResponse.ok) {
          throw new Error(
            `Authentication failed: ${authResponse.status} ${authResponse.statusText}`
          );
        }

        const contentType = authResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Authentication response is not JSON");
        }

        const authData: AuthResponse = await authResponse.json();
        if (
          !authData.success ||
          authData.user?.role?.toUpperCase() !== "ADMIN"
        ) {
          setIsAuthorized(false);
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error during authentication:", error);
        setIsAuthorized(false);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthorized === true) {
      const fetchAllIps = async () => {
        try {
          const response = await fetch(
            `${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/ips/filter`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                hasReviews: false,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch IPS: ${response.status} ${response.statusText}`
            );
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response from /api/v1.0.0/ips/filter is not JSON");
          }

          const data: IpsListResponse = await response.json();
          if (data.success && data.data) {
            setAllIps(data.data);
            const uniqueTowns = Array.from(
              new Set(data.data.map((ips) => ips.town || "Sin municipio"))
            ).sort();
            setTowns(uniqueTowns);
          } else {
            throw new Error(data.error || "No IPS data returned");
          }
        } catch (error) {
          console.error("Error fetching IPS:", error);
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred while fetching IPS"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllIps();
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized === true && allIps.length > 0) {
      const filteredByName = searchTerm
        ? allIps.filter((ips) =>
            ips.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allIps;

      const filteredIps = appliedTown
        ? filteredByName.filter(
            (ips) => (ips.town || "Sin municipio") === appliedTown
          )
        : filteredByName;

      const totalFilteredItems = filteredIps.length;
      setTotalItems(totalFilteredItems);
      setTotalPages(Math.ceil(totalFilteredItems / itemsPerPage));

      if (currentPage > Math.ceil(totalFilteredItems / itemsPerPage)) {
        setCurrentPage(1);
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedIps = filteredIps.slice(startIndex, endIndex);

      const grouped = paginatedIps.reduce((acc, ips) => {
        const town = ips.town || "Sin municipio";
        acc[town] = acc[town] || [];
        acc[town].push(ips);
        return acc;
      }, {} as { [key: string]: IpsResponse[] });

      setGroupedIps(grouped);
    }
  }, [
    isAuthorized,
    allIps,
    currentPage,
    itemsPerPage,
    appliedTown,
    searchTerm,
  ]);

  const handlePromote = async (name: string, level: number) => {
    if (!level && level !== 0) {
      toast.error("Por favor seleccione un nivel de promoción.");
      return;
    }

    try {
      const res = await fetch("/api/v1.0.0/ips/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, promoted: level }),
      });

      if (!res.ok) {
        throw new Error("Failed to promote");
      }
      toast.success("¡Promoción satisfactoria!");
      router.refresh();
    } catch (error) {
      toast.error("Error al promocionar. Intente de nuevo.");
      console.error("Promotion failed:", error);
    }
  };

  const handleFilterByTown = () => {
    setAppliedTown(selectedTown);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTown("");
    setAppliedTown("");
    setCurrentPage(1);
  };

  if (isAuthorized === null) {
    return null;
  }

  if (isAuthorized === false) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400 text-lg font-medium">
          {error}
        </p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    pageNumbers.push(1);
    let startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(2, endPage - maxPagesToShow + 1);
    }

    if (startPage > 2) pageNumbers.push("...before");
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push("...after");
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 text-center tracking-tight mb-6">
            Lista de IPS
          </h1>
          <div className="flex justify-start mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium transition-all duration-300 h-10"
            >
              <ChevronLeft className="w-4 h-4" />
              Regresar al Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de la IPS..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 pl-10 h-11 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="flex-1">
              <select
                id="town"
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 h-11 shadow-sm appearance-none"
              >
                <option value="">Filtrar por municipio</option>
                {towns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={handleFilterByTown}
                className="px-4 py-2.5 rounded-xl bg-blue-500/90 text-white hover:bg-blue-600 text-sm font-medium transition-all duration-300 h-11 w-28 shadow-sm"
              >
                Filtrar
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-red-500/90 text-white hover:bg-red-600 text-sm font-medium transition-all duration-300 h-11 w-28 flex items-center justify-center shadow-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </button>
              <Link
                href="/admin/ips/create"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/90 text-white hover:bg-green-600 text-sm font-medium transition-all duration-300 h-11 w-28 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
            Cargando...
          </p>
        ) : Object.keys(groupedIps).length > 0 ? (
          Object.keys(groupedIps)
            .sort()
            .map((town) => (
              <div key={town} className="mb-12">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  {town}
                </h2>
                <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                  <table className="w-full text-left table-fixed">
                    <thead>
                      <tr className="bg-gray-100/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100">
                        <th className="w-1/3 p-4 font-medium">Nombre</th>
                        <th className="w-1/3 p-4 font-medium">Dirección</th>
                        <th className="w-1/3 p-4 font-medium text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedIps[town].map((ips) => (
                        <tr
                          key={ips._id}
                          className="border-t border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <td className="w-1/3 p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-5 h-5">
                                <Hospital className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                              </div>
                              <span className="text-gray-900 dark:text-gray-100 font-medium truncate flex-1">
                                {ips.name}
                              </span>
                            </div>
                          </td>
                          <td className="w-1/3 p-4 text-gray-600 dark:text-gray-300 align-middle truncate">
                            {ips.address}
                          </td>
                          <td className="w-1/3 p-4 align-middle">
                            <div className="flex justify-center items-center gap-3">
                              <Link
                                href={`/admin/ips/${encodeURIComponent(
                                  ips.name
                                )}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 w-[140px] h-10"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalles
                              </Link>
                              <div className="relative">
                                <select
                                  id={`promote-select-${ips._id}`}
                                  className="appearance-none w-16 h-10 pl-3 pr-8 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-sm text-sm"
                                >
                                  {[0, 1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                              </div>
                              <button
                                onClick={() => {
                                  const select = document.getElementById(
                                    `promote-select-${ips._id}`
                                  ) as HTMLSelectElement;
                                  const num = Number(select.value);
                                  handlePromote(ips.name, num);
                                }}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 w-[140px] h-10"
                              >
                                Promocionar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
            No se encontraron IPS.
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {getPageNumbers().map((page, index) =>
                typeof page === "string" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="text-gray-500 dark:text-gray-400 px-2"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? "bg-blue-500/90 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm tracking-tight">
              Mostrando {startIndex} – {endIndex} de {totalItems} resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}