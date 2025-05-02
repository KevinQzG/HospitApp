"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Mail,
  Phone,
  Home,
  ArrowLeft,
  Hospital,
  Stethoscope,
  UserCheck,
  Pencil,
  Trash2,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

type IpsDetailClientProps = {
  ipsData: IpsResponse;
  initialReviewsResult: {
    reviews: ReviewResponse[];
    pagination?: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  } | null;
};

type ReviewsResponse = {
  success: boolean;
  error?: string;
  data?: {
    result: ReviewResponse[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
};

type UserSession = {
  email: string;
} | null;

export default function IpsDetailClient({
  ipsData,
  initialReviewsResult,
}: IpsDetailClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"details" | "map">("details");
  const [userSession, setUserSession] = useState<UserSession>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch(`/api/v1.0.0/auth/session`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserSession({ email: data.email });
          } else {
            setUserSession(null);
          }
        } else {
          setUserSession(null);
        }
      } catch (err) {
        console.error("Failed to fetch user session:", err);
        setUserSession(null);
      }
    };

    fetchUserSession();
  }, []);

  const formatEpsName = (name: string): string => {
    let formattedName = name.replace(/\bCrus Blanca\b/i, "Cruz Blanca");
    formattedName = formattedName.replace(/\bEPS-S\b|\bEPS-C\b/g, "EPS").trim();
    formattedName = formattedName.toUpperCase();
    return formattedName;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Hospital className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white whitespace-normal break-words max-w-xs sm:max-w-none">
                {ipsData.name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Resultados
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-end items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("details")}
              className={`px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
                viewMode === "details"
                  ? "bg-blue-700 text-white shadow-md dark:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Detalles
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
                viewMode === "map"
                  ? "bg-blue-700 text-white shadow-md dark:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Mapa
            </button>
          </div>
        </div>

        {viewMode === "details" ? (
          <DetailsView
            ipsData={ipsData}
            formatEpsName={formatEpsName}
            initialReviewsResult={initialReviewsResult}
            userSession={userSession}
          />
        ) : (
          <MapView ipsData={ipsData} router={router} />
        )}
      </main>
    </div>
  );
}

function DetailsView({
  ipsData,
  formatEpsName,
  initialReviewsResult,
  userSession,
}: {
  ipsData: NonNullable<LookIpsResponse["data"]>;
  initialReviewsResult: IpsDetailClientProps["initialReviewsResult"];
  userSession: UserSession;
  formatEpsName: (name: string) => string;
}) {
  const router = useRouter();
  const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}`;
  const WAZE_URL = `https://waze.com/ul?ll=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}&navigate=yes`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewsResult, setReviewsResult] = useState(initialReviewsResult);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComments, setEditComments] = useState<string>("");
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComments, setNewComments] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    if (reviewsResult && reviewsResult.reviews.length > 0) {
      const avg =
        reviewsResult.reviews.reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        ) / reviewsResult.reviews.length;
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  }, [reviewsResult]);

  const fetchReviewsPage = async (page: number) => {
    if (
      page === 1 &&
      initialReviewsResult &&
      reviewsResult?.pagination?.page === 1
    ) {
      setReviewsResult(initialReviewsResult);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1.0.0/reviews/get/all/pagination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
          pageSize: reviewsResult?.pagination?.pageSize || 5,
          filters: [{ field: "ips", value: ipsData._id }],
          sorts: [
            { field: "rating", direction: -1 },
            { field: "updatedAt", direction: 1 },
          ],
        }),
      });

      if (!response.ok) {
        const errorData: ReviewsResponse = await response.json();
        throw new Error(
          errorData.error || "No se pudieron obtener las reseñas"
        );
      }

      const data: ReviewsResponse = await response.json();
      if (data.data) {
        setReviewsResult({
          reviews: data.data.result,
          pagination: data.data.pagination || {
            total: 0,
            totalPages: 0,
            page: 1,
            pageSize: 5,
          },
        });
      } else {
        setReviewsResult({
          reviews: [],
          pagination: { total: 0, totalPages: 0, page: 1, pageSize: 5 },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = reviewsResult?.pagination?.totalPages || 1;
    const currentPage = reviewsResult?.pagination?.page || 1;
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }
    fetchReviewsPage(newPage);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!userSession) return;

    // Guardar el estado anterior para revertir en caso de error
    const previousReviews = reviewsResult?.reviews || [];
    const previousPagination = reviewsResult?.pagination;

    // Actualizar el estado optimistamente
    setReviewsResult((prev) => {
      if (!prev) return prev;
      const updatedReviews = prev.reviews.filter(
        (review) => review._id !== reviewId
      );
      return {
        reviews: updatedReviews,
        pagination: {
          ...prev.pagination,
          total: (prev.pagination?.total || 0) - 1,
          totalPages: Math.ceil(
            ((prev.pagination?.total || 0) - 1) /
              (prev.pagination?.pageSize || 5)
          ),
          page: prev.pagination?.page || 1,
          pageSize: prev.pagination?.pageSize || 5,
        },
      };
    });

    try {
      const response = await fetch(`/api/v1.0.0/reviews/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: reviewId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo eliminar la reseña");
      }

      toast.success("¡Reseña eliminada correctamente!");
    } catch (err) {
      // Revertir el estado si la eliminación falla
      setReviewsResult({
        reviews: previousReviews,
        pagination: previousPagination,
      });
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar la reseña"
      );
      toast.error("Error al eliminar la reseña");
    }
  };

  const handleEditReviewStart = (review: ReviewResponse) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComments(review.comments);
  };

  const handleEditReviewSave = async (reviewId: string) => {
    if (!userSession) return;

    if (editRating < 1 || editRating > 5) {
      setError("La calificación debe estar entre 1 y 5 estrellas");
      return;
    }

    // Guardar el estado anterior para revertir en caso de error
    const previousReviews = reviewsResult?.reviews || [];

    // Actualizar el estado optimistamente
    setReviewsResult((prev) => {
      if (!prev) return prev;
      const updatedReviews = prev.reviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              rating: editRating,
              comments: editComments,
              lastUpdated: new Date().toISOString(),
            }
          : review
      );
      return {
        reviews: updatedReviews,
        pagination: prev.pagination,
      };
    });

    try {
      const response = await fetch(`/api/v1.0.0/reviews/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: reviewId,
          rating: editRating,
          comments: editComments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo actualizar la reseña");
      }

      toast.success("¡Reseña actualizada correctamente!");
      setEditingReviewId(null);
    } catch (err) {
      // Revertir el estado si la edición falla
      setReviewsResult({
        reviews: previousReviews,
        pagination: reviewsResult?.pagination,
      });
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar la reseña"
      );
      toast.error("Error al actualizar la reseña");
    }
  };

  const handleAddReview = async () => {
    if (!userSession) {
      router.push("/login");
      return;
    }

    if (!newRating || !newComments) {
      setError("La calificación y los comentarios son obligatorios");
      return;
    }

    if (newRating < 1 || newRating > 5) {
      setError("La calificación debe estar entre 1 y 5 estrellas");
      return;
    }

    try {
      const response = await fetch(`/api/v1.0.0/reviews/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ips: ipsData._id,
          rating: newRating,
          comments: newComments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo crear la reseña");
      }

      const newReview = await response.json();

      // Crear un objeto provisional que cumpla con ReviewResponse
      const newReviewData: ReviewResponse = {
        _id: newReview.review || "temp-id",
        user: userSession.email,
        rating: newRating,
        comments: newComments,
        ips: ipsData._id,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userEmail: userSession.email,
      };

      // Actualizar el estado inmediatamente con la nueva reseña
      setReviewsResult((prev) => ({
        reviews: [newReviewData, ...(prev?.reviews || [])],
        pagination: prev?.pagination
          ? {
              ...prev.pagination,
              total: (prev.pagination.total || 0) + 1,
              totalPages: Math.ceil(
                ((prev.pagination.total || 0) + 1) /
                  (prev.pagination.pageSize || 5)
              ),
            }
          : {
              total: 1,
              totalPages: 1,
              page: 1,
              pageSize: 5,
            },
      }));

      toast.success("¡Reseña publicada correctamente!");
      setNewRating(0);
      setNewComments("");
      setShowAddReviewForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la reseña"
      );
      toast.error("Error al crear la reseña");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <Hospital className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
          Información General
        </h2>
        <ul className="space-y-5 text-gray-600 dark:text-gray-300 text-base">
          <li className="flex items-center">
            <MapPin
              size={20}
              className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <span>
              {ipsData.department}, {ipsData.town}
            </span>
          </li>
          <li className="flex items-center">
            <MapPin
              size={20}
              className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <span>{ipsData.address}</span>
          </li>
          {ipsData.phone && (
            <li className="flex items-center">
              <Phone
                size={20}
                className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
              />
              <span>{ipsData.phone}</span>
            </li>
          )}
          {ipsData.email && (
            <li className="flex items-center">
              <Mail
                size={20}
                className="mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
              />
              <span>{ipsData.email}</span>
            </li>
          )}
          {ipsData.level && (
            <li className="flex items-center">
              <span className="font-medium text-gray-800 dark:text-gray-200 mr-2">
                Nivel:
              </span>
              <span>{ipsData.level}</span>
            </li>
          )}
        </ul>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          Cómo llegar
        </h2>
        <nav aria-label="Opciones de navegación">
          <ul className="space-y-4">
            <li className="flex flex-col items-start">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4"
                aria-label="Abrir ubicación en Google Maps"
              >
                <Image
                  src="/stock/GMaps.png"
                  alt="Google Maps Icon"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-12 object-contain"
                />
              </a>
            </li>
            <li className="flex flex-col items-start">
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4"
                aria-label="Abrir ubicación en Waze"
              >
                <Image
                  src="/stock/Waze.png"
                  alt="Waze Icon"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-12 object-contain"
                />
              </a>
            </li>
          </ul>
        </nav>
      </section>

      {ipsData.eps && ipsData.eps.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 md:col-span-2 hover:shadow-md transition-all duration-300">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            EPS Aceptadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ipsData.eps.map((eps) => (
              <div
                key={eps._id}
                className="flex items-center bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
              >
                <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formatEpsName(eps.name)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {ipsData.specialties && ipsData.specialties.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 md:col-span-2 hover:shadow-md transition-all duration-300">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            Especialidades
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ipsData.specialties.map((spec) => (
              <div
                key={spec._id}
                className="flex items-center bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
              >
                <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {spec.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 md:col-span-2 hover:shadow-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <Star className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
          Reseñas
        </h2>

        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-500"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {averageRating.toFixed(1)} (
              {reviewsResult?.pagination?.total || 0} reseñas)
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Cargando reseñas...
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : null}

        <button
          onClick={() => setShowAddReviewForm(!showAddReviewForm)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Agregar Reseña
        </button>

        {showAddReviewForm && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Nueva Reseña
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación
                </label>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                        i < newRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-500 hover:text-yellow-300"
                      }`}
                      onClick={() => setNewRating(i + 1)}
                      aria-label={`Calificar con ${i + 1} estrella${
                        i + 1 === 1 ? "" : "s"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="newComments"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Comentarios
                </label>
                <textarea
                  id="newComments"
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  rows={4}
                  placeholder="Escribe tu comentario aquí..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowAddReviewForm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {reviewsResult && reviewsResult.reviews.length > 0 ? (
          <>
            {reviewsResult.reviews.map((review) => (
              <div
                key={review._id}
                className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {editingReviewId === review._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Calificación
                      </label>
                      <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                              i < editRating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-500 hover:text-yellow-300"
                            }`}
                            onClick={() => setEditRating(i + 1)}
                            aria-label={`Calificar con ${i + 1} estrella${
                              i + 1 === 1 ? "" : "s"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="editComments"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Comentarios
                      </label>
                      <textarea
                        id="editComments"
                        value={editComments}
                        onChange={(e) => setEditComments(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        rows={4}
                        placeholder="Escribe tu comentario aquí..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditReviewSave(review._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {review.rating} / 5
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          <strong>Usuario:</strong>{" "}
                          {review.userEmail || "Anónimo"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <strong>Última actualización:</strong>{" "}
                          {review.lastUpdated
                            ? new Date(review.lastUpdated).toLocaleDateString(
                                "es-CO"
                              )
                            : "Fecha no disponible"}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {review.comments}
                        </p>
                      </div>
                      {userSession &&
                        userSession.email === review.userEmail && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReviewStart(review)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>
            ))}

            {reviewsResult?.pagination &&
              (reviewsResult.pagination.totalPages || 0) > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(
                        (reviewsResult.pagination?.page || 1) - 1
                      )
                    }
                    disabled={
                      (reviewsResult.pagination?.page || 1) === 1 || loading
                    }
                    className={`p-2 rounded-full transition-all duration-300 ${
                      (reviewsResult.pagination?.page || 1) === 1 || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(reviewsResult.pagination.totalPages || 0)].map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                          (reviewsResult.pagination?.page || 1) === i + 1
                            ? "bg-blue-600 text-white shadow-md dark:bg-blue-500"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      handlePageChange(
                        (reviewsResult.pagination?.page || 1) + 1
                      )
                    }
                    disabled={
                      (reviewsResult.pagination?.page || 1) ===
                        (reviewsResult.pagination?.totalPages || 1) || loading
                    }
                    className={`p-2 rounded-full transition-all duration-300 ${
                      (reviewsResult.pagination?.page || 1) ===
                        (reviewsResult.pagination?.totalPages || 1) || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 italic">
            No hay reseñas disponibles para esta IPS. ¡Sé el primero en dejar
            una!
          </p>
        )}
      </section>
    </div>
  );
}

function MapView({
  ipsData,
  router,
}: {
  ipsData: NonNullable<LookIpsResponse["data"]>;
  router: ReturnType<typeof useRouter>;
}) {
  const [distance, setDistance] = useState<number | null>(null);
  let userMarker: mapboxgl.Marker | null = null;

  useEffect(() => {
    const [hospitalLng, hospitalLat] = ipsData.location.coordinates;
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const initialStyle = darkModeMediaQuery.matches
      ? "mapbox://styles/mapbox/dark-v10"
      : "mapbox://styles/mapbox/streets-v12";

    const initializedMap = new mapboxgl.Map({
      container: "map",
      style: initialStyle,
      center: [hospitalLng, hospitalLat],
      zoom: 12,
    });

    initializedMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    initializedMap.addControl(new mapboxgl.FullscreenControl(), "top-right");

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: false,
    });
    initializedMap.addControl(geolocate, "top-right");

    const hospitalMarkerElement = document.createElement("div");
    hospitalMarkerElement.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
      </svg>
    `;

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl max-w-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mb-2">${
          ipsData.name
        }</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">${
          ipsData.address
        }, ${ipsData.town ?? ""}, ${ipsData.department ?? ""}</p>
      </div>
    `;
    popupContent.querySelector("h3")?.addEventListener("click", () => {
      router.push(`/ips-details/${encodeURIComponent(ipsData.name)}`);
    });

    new mapboxgl.Marker({ element: hospitalMarkerElement })
      .setLngLat([hospitalLng, hospitalLat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
      .addTo(initializedMap);

    const addRoute = (userLng: number, userLat: number) => {
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${hospitalLng},${hospitalLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;
            const routeDistance = data.routes[0].distance / 1000;
            setDistance(parseFloat(routeDistance.toFixed(2)));

            if (initializedMap.getSource("route")) {
              (
                initializedMap.getSource("route") as mapboxgl.GeoJSONSource
              ).setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              });
            } else {
              initializedMap.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: route,
                  },
                },
              });
              initializedMap.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#2563EB",
                  "line-width": 5,
                  "line-opacity": 0.85,
                },
              });
            }
          }
        })
        .catch((error) => console.error("Error fetching route:", error));
    };

    const recenterMap = (userLng?: number, userLat?: number) => {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([hospitalLng, hospitalLat]);
      if (userLng && userLat) bounds.extend([userLng, userLat]);
      initializedMap.fitBounds(bounds, { padding: 50, duration: 1000 });
    };

    initializedMap.on("load", () => {
      initializedMap.resize();
      geolocate.trigger();
    });

    geolocate.on("geolocate", (e: GeolocationPosition) => {
      const userLng = e.coords.longitude;
      const userLat = e.coords.latitude;

      if (userMarker) {
        userMarker.setLngLat([userLng, userLat]);
      } else {
        const userMarkerElement = document.createElement("div");
        userMarkerElement.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#D73535" stroke="#FFFFFF" stroke-width="1.5"/>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-2 2h4v6h-1v-2h-2v2h-1v-6z" fill="#FFFFFF"/>
          </svg>
        `;

        userMarker = new mapboxgl.Marker({ element: userMarkerElement })
          .setLngLat([userLng, userLat])
          .addTo(initializedMap);
      }

      recenterMap(userLng, userLat);
      addRoute(userLng, userLat);
    });

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      initializedMap.setStyle(
        e.matches
          ? "mapbox://styles/mapbox/dark-v10"
          : "mapbox://styles/mapbox/streets-v12"
      );
    };
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    if (darkModeMediaQuery.matches) {
      initializedMap.setStyle("mapbox://styles/mapbox/dark-v10");
    }

    return () => {
      initializedMap.remove();
      if (userMarker) userMarker.remove();
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, [ipsData, router]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div id="map" className="w-full h-full" />
      {distance !== null && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {distance} km
          </span>
        </div>
      )}
    </div>
  );
}