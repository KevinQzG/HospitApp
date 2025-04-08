"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Hospital, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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
  const [groupedIps, setGroupedIps] = useState<{ [key: string]: IpsResponse[] }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(21);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch("/api/v1.0.0/auth/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            authenticationNeeded: true,
            authenticationRoles: ["ADMIN"],
          }),
        });

        if (!authResponse.ok || !authResponse.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Authentication failed or invalid response");
        }

        const authData: AuthResponse = await authResponse.json();
        if (!authData.success) {
          setIsAuthorized(false);
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch {
        setIsAuthorized(false);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthorized === true) {
      const fetchIps = async (page: number) => {
        try {
          setLoading(true);
          const response = await fetch("/api/v1.0.0/ips/filter/pagination", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              page,
              pageSize: itemsPerPage,
              hasReviews: false,
            }),
          });

          if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
            throw new Error("Failed to fetch IPS or invalid response");
          }

          const data: IpsListResponse = await response.json();
          if (data.success && data.data) {
            setTotalItems(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);

            const grouped = data.data.reduce((acc, ips) => {
              const town = ips.town || "Sin municipio";
              acc[town] = acc[town] || [];
              acc[town].push(ips);
              return acc;
            }, {} as { [key: string]: IpsResponse[] });

            setGroupedIps(grouped);
          } else {
            throw new Error(data.error || "No IPS data returned");
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchIps(currentPage);
    }
  }, [isAuthorized, currentPage, itemsPerPage]);

  if (isAuthorized === null) {
    return null;
  }

  if (isAuthorized === false) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
          </svg>
          <span className="text-lg">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600 dark:text-red-500 text-lg font-medium">{error}</p>
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
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-10 text-center tracking-tight">
          Lista de IPS
        </h1>

        {Object.keys(groupedIps).length > 0 ? (
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
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <th className="w-1/3 p-4 font-medium">Nombre</th>
                        <th className="w-1/3 p-4 font-medium">Dirección</th>
                        <th className="w-1/3 p-4 font-medium text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedIps[town].map((ips) => (
                        <tr
                          key={ips._id}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          <td className="w-1/3 p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Hospital className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                                {ips.name}
                              </span>
                            </div>
                          </td>
                          <td className="w-1/3 p-4 text-gray-600 dark:text-gray-300 align-middle truncate">
                            {ips.address}
                          </td>
                          <td className="w-1/3 p-4 align-middle">
                            <div className="flex justify-center">
                              <Link
                                href={`/admin/ips/${encodeURIComponent(ips.name)}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 shadow"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalles
                              </Link>
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
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">No se encontraron IPS.</p>
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
                  <span key={`ellipsis-${index}`} className="text-gray-500 dark:text-gray-400 px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? "bg-blue-600 text-white shadow"
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