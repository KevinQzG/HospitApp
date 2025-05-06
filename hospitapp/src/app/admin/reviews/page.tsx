"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Star, ArrowLeft, Hospital, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ENV } from "@/config/env";

type Review = {
  _id: string;
  user: string;
  ips: string;
  rating: number;
  comments: string;
  createdAt: string;
  lastUpdated: string;
  userEmail: string;
  ipsName: string;
};

type ReviewsResponse = {
  success: boolean;
  data?: {
    result: Review[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
  error?: string;
};

type AuthResponse = {
  success: boolean;
  user?: { role: string };
  error?: string;
  message?: string;
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: 10,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const verifyAdminAndFetchReviews = async () => {
      try {
        // Verificar autenticación y rol de administrador
        const authResponse = await fetch(
          `${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/auth/verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              authenticationNeeded: true,
              authenticationRoles: ["ADMIN"],
            }),
          }
        );

        const authData: AuthResponse = await authResponse.json();
        if (
          !authResponse.ok ||
          !authData.success ||
          authData.user?.role?.toUpperCase() !== "ADMIN"
        ) {
          setIsAuthorized(false);
          router.push("/");
          return;
        }

        setIsAuthorized(true);

        // Obtener reseñas
        await fetchReviews(pagination.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setIsAuthorized(false);
        router.push("/");
      }
    };

    verifyAdminAndFetchReviews();
  }, [router]);

  const fetchReviews = async (page: number) => {
    try {
      const response = await fetch(
        `${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/reviews/get/all/pagination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            page,
            pageSize: pagination.pageSize,
            sorts: [
              { field: "rating", direction: -1 }, 
              { field: "createdAt", direction: -1 }
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData: ReviewsResponse = await response.json();
        throw new Error(errorData.error || "Error al obtener reseñas");
      }

      const reviewsData: ReviewsResponse = await response.json();
      if (reviewsData.success && reviewsData.data) {
        setReviews(reviewsData.data.result);
        setPagination(reviewsData.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener reseñas");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(
        `${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/reviews/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: reviewId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar reseña");
      }

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.pageSize),
      }));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar reseña");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchReviews(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    pageNumbers.push(1);
    let startPage = Math.max(2, pagination.page - 2);
    const endPage = Math.min(pagination.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(2, endPage - maxPagesToShow + 1);
    }

    if (startPage > 2) pageNumbers.push("...before");
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < pagination.totalPages - 1) pageNumbers.push("...after");
    if (pagination.totalPages > 1) pageNumbers.push(pagination.totalPages);

    return pageNumbers;
  };

  if (isAuthorized === null) {
    return null; // No renderizar nada mientras se verifica la autenticación
  }

  if (isAuthorized === false) {
    return null; // No renderizar nada si no está autorizado
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md bg-gray-800 rounded-3xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-gray-100 mb-3 tracking-tight">
            Error
          </h1>
          <p className="text-gray-400 mb-6 text-sm">{error}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const startIndex = (pagination.page - 1) * pagination.pageSize + 1;
  const endIndex = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-100">
              Reseñas
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            {pagination.total} reseñas
          </div>
        </div>

        {/* Reviews Table */}
        {reviews.length > 0 ? (
          <div className="bg-gray-800 rounded-3xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-left text-sm text-gray-400">
                  <th className="p-5 font-medium">Usuario</th>
                  <th className="p-5 font-medium">IPS</th>
                  <th className="p-5 font-medium">Calificación</th>
                  <th className="p-5 font-medium">Comentario</th>
                  <th className="p-5 font-medium">Fecha</th>
                  <th className="p-5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200"
                  >
                    <td className="p-5">
                      <div className="text-sm font-medium text-gray-100">
                        {review.userEmail}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Hospital className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-100">
                          {review.ipsName}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-300 max-w-xs truncate">
                      {review.comments}
                    </td>
                    <td className="p-5 text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => setDeleteConfirm(review._id)}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded-full transition-all duration-200"
                        title="Eliminar reseña"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-4 p-6 bg-gray-800 border-t border-gray-700">
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-full text-gray-400 disabled:text-gray-600 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {getPageNumbers().map((page, index) =>
                    typeof page === "string" ? (
                      <span key={`ellipsis-${index}`} className="text-gray-400 px-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                          page === pagination.page
                            ? "bg-blue-600 text-white shadow"
                            : "text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-full text-gray-400 disabled:text-gray-600 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              <p className="text-gray-400 text-sm tracking-tight">
                Mostrando {startIndex} – {endIndex} de {pagination.total} reseñas
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-3xl shadow-md p-8 text-center">
            <p className="text-gray-400 text-lg font-medium">
              No hay reseñas disponibles
            </p>
          </div>
        )}
      </div>

      {/* Overlay for Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              ¿Eliminar esta reseña?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 rounded-full hover:bg-gray-500 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteReview(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}