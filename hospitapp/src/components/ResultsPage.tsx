"use client";

import { useEffect, useState, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Hospital,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import SearchFormClient, { SearchFormSubmitHandler } from "./SearchFormClient";
import { SearchFormClientProps } from "@/services/cachers/data_caching.service";
import { Suspense } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface Specialty {
  _id: string;
  name: string;
}

interface Eps {
  _id: string;
  name: string;
}

interface IpsResponse {
  _id: string;
  name: string;
  address: string;
  town?: string;
  department?: string;
  location: { type: string; coordinates: [number, number] };
  phone?: string | number;
  email?: string;
  level?: number;
  distance?: number; // Distancia en metros
  specialties?: Specialty[];
  eps?: Eps[];
  maps?: string;
  waze?: string;
  averageRating?: number; // Added to store the average rating (1-5)
}

interface ReviewResponse {
  _id: string;
  ips: string; // Updated to match the field name from AdminReviewsPage (was ipsId)
  rating: number; // Rating field (1-5)
  userEmail?: string;
  comments?: string; // Updated to match AdminReviewsPage (was comment)
  createdAt?: string;
  lastUpdated?: string;
  user?: string;
  ipsName?: string;
}

interface SearchResponse {
  success: boolean;
  error?: string;
  data?: IpsResponse[];
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
}

interface AllReviewsResponse {
  success: boolean;
  error?: string;
  data?: ReviewResponse[];
}

interface SearchRequestBody {
  coordinates: [number, number];
  max_distance: number;
  page: number;
  page_size: number;
  specialties?: string[];
  eps_names?: string[];
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const roundedRating = Math.round(rating); // Round to the nearest integer (1-5)
  const fullStars = roundedRating; // Number of full stars
  const emptyStars = 5 - fullStars; // Remaining empty stars

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="ml-1 text-gray-600 dark:text-gray-300 text-xs">
        ({roundedRating})
      </span>
    </div>
  );
};

const RESULT_ITEM = memo(({ item }: { item: IpsResponse }) => (
  <Link
    href={`/ips-details/${encodeURIComponent(item.name)}`}
    className="block p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-36 flex flex-col"
  >
    <div className="flex items-start space-x-3 flex-1">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md flex-shrink-0">
        <Hospital className="w-6 h-6 text-blue-700 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {item.name}
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          {item.address}
          {item.town && `, ${item.town}`}
          {item.department && `, ${item.department}`}
        </p>
        <p className="text-xs text-gray-800 dark:text-gray-200 mt-1">
          Distancia:{" "}
          {item.distance !== undefined
            ? `${Math.round(item.distance)} metros`
            : "N/A"}
        </p>
        <div className="mt-1">
          <StarRating rating={item.averageRating || 0} />
        </div>
      </div>
    </div>
  </Link>
));

RESULT_ITEM.displayName = "RESULT_ITEM";

function ResultsDisplay({ specialties, eps }: SearchFormClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allResults, setAllResults] = useState<IpsResponse[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<IpsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listView, setListView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 21;
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userCoordinates, setUserCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isNewSearch, setIsNewSearch] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        (err) => {
          console.warn("No se pudo obtener la ubicación del usuario:", err);
          setUserCoordinates([-75.5849, 6.1816]); // Coordenadas por defecto
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.warn("Geolocalización no soportada");
      setUserCoordinates([-75.5849, 6.1816]);
    }
  }, []);

  useEffect(() => {
    const fetchFilteredResults = async () => {
      try {
        // Obtener los parámetros de la URL
        const maxDistance = searchParams.get("maxDistance") ?? "20000";
        const specialtiesParam =
          searchParams.get("specialties")?.split(",").filter(Boolean) || [];
        const epsParam =
          searchParams.get("eps")?.split(",").filter(Boolean) || [];
        const coordinatesStr = searchParams.get("coordinates");
        let coordinates: [number, number] = userCoordinates || [
          -75.5849, 6.1816,
        ];
        if (coordinatesStr) {
          const [lng, lat] = coordinatesStr.split(",").map(Number);
          if (!isNaN(lng) && !isNaN(lat)) coordinates = [lng, lat];
        }

        const requestBody: SearchRequestBody = {
          coordinates,
          "max_distance": parseInt(maxDistance),
          page: 1,
          "page_size": 2890,
        };

        if (specialtiesParam.length > 0) {
          requestBody.specialties = specialtiesParam;
        }

        if (epsParam.length > 0) {
          requestBody["eps_names"] = epsParam;
        }

        console.log("Parámetros enviados a la API de búsqueda:", requestBody);

        const response = await fetch("/api/search_ips/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok)
          throw new Error("No se pudieron obtener los resultados filtrados");

        const data: SearchResponse = await response.json();
        let filteredResults = data.data || [];

        // Fetch all reviews to calculate average ratings for each IPS
        const reviewsResponse = await fetch("/api/v1.0.0/reviews/get/all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        let allReviews: ReviewResponse[] = [];
        if (reviewsResponse.ok) {
          const reviewsData: AllReviewsResponse = await reviewsResponse.json();
          if (reviewsData.success && reviewsData.data) {
            allReviews = reviewsData.data;
            console.log("Reseñas obtenidas:", allReviews); // Debug: Log all reviews
          } else {
            console.error("Error al obtener reseñas:", reviewsData.error);
          }
        } else {
          console.error("Error en la respuesta de la API de reseñas:", reviewsResponse.status);
        }

        // Calculate average rating for each IPS
        filteredResults = filteredResults.map((item: IpsResponse) => {
          const ipsReviews = allReviews.filter(
            (review) => review.ips === item._id // Updated to use review.ips instead of review.ipsId
          );
          console.log(`Reseñas para IPS ${item.name} (${item._id}):`, ipsReviews); // Debug: Log reviews for each IPS
          const averageRating =
            ipsReviews.length > 0
              ? ipsReviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                ) / ipsReviews.length
              : 0;
          console.log(`Calificación promedio para ${item.name}: ${averageRating}`); // Debug: Log average rating
          return { ...item, averageRating };
        });

        // Log para depurar los resultados recibidos de la API
        console.log("Resultados recibidos de la API:", filteredResults.length);
        console.log("Paginación del servidor:", data.pagination);
        console.log("Primeros 5 resultados:", filteredResults.slice(0, 5));

        // Filtrado adicional en el cliente para asegurarnos de que solo se muestren los IPS con la EPS seleccionada
        if (epsParam.length > 0) {
          filteredResults = filteredResults.filter((item: IpsResponse) => {
            if (!item.eps || item.eps.length === 0) return false;
            const hasMatchingEps = item.eps.some((epsItem) =>
              epsParam.includes(epsItem._id)
            );
            if (!hasMatchingEps) {
              console.log(
                `IPS "${item.name}" no coincide con las EPS seleccionadas (${epsParam}):`,
                item.eps
              );
            }
            return hasMatchingEps;
          });
        }

        // Calcular las distancias si tenemos las coordenadas del usuario
        if (userCoordinates) {
          filteredResults = filteredResults.map((item: IpsResponse) => ({
            ...item,
            distance: calculateDistance(
              userCoordinates[1], // Latitud del usuario
              userCoordinates[0], // Longitud del usuario
              item.location.coordinates[1], // Latitud del IPS
              item.location.coordinates[0] // Longitud del IPS
            ),
          }));

          filteredResults.sort(
            (a: IpsResponse, b: IpsResponse) =>
              (a.distance || 0) - (b.distance || 0)
          );
        }

        setAllResults(filteredResults);
        setTotalResults(filteredResults.length); // Usar la longitud de los resultados filtrados
        setTotalPages(Math.ceil(filteredResults.length / pageSize));

        if (isNewSearch) {
          setCurrentPage(1); // Reiniciar a la página 1 para una nueva búsqueda
          setIsNewSearch(false); // Reiniciar la bandera
        } else {
          const pageFromParams = parseInt(searchParams.get("page") ?? "1");
          setCurrentPage(pageFromParams);
        }

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setPaginatedResults(filteredResults.slice(start, end));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (userCoordinates !== null) {
      fetchFilteredResults();
    }
  }, [searchParams, userCoordinates, isNewSearch]);

  // Manejar los cambios en la búsqueda y la paginación
  useEffect(() => {
    const filtered = allResults.filter((item) =>
      `${item.name} ${item.address} ${item.town || ""} ${
        item.department || ""
      }`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setTotalResults(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    // Actualizar los resultados paginados instantáneamente sin transición
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedResults(filtered.slice(start, end));
  }, [searchQuery, allResults, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    // Actualizar la URL sin recargar la página
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`/results?${currentParams.toString()}`, { scroll: false });
  };

  const handleSearchSubmit: SearchFormSubmitHandler = (isSubmitting) => {
    setSearchLoading(isSubmitting);
    if (isSubmitting) {
      setIsNewSearch(true); // Marcar una nueva búsqueda para reiniciar la página
    }
  };

  const maxVisiblePages = 5;
  const pageRange = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  if (loading || searchLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-4">
          Cargando resultados...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const coordinatesStr = searchParams.get("coordinates");
  let coordinates: [number, number] = userCoordinates || [-75.5849, 6.1816];
  if (coordinatesStr) {
    const [lng, lat] = coordinatesStr.split(",").map(Number);
    if (!isNaN(lng) && !isNaN(lat)) coordinates = [lng, lat];
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-[#ECF6FF] dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center mb-4 sm:mb-6 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
      >
        <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        <span className="text-base sm:text-lg font-medium">Volver al Inicio</span>
      </Link>

      <div className="mb-6 sm:mb-10">
        <SearchFormClient
          specialties={specialties}
          eps={eps}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Resultados de Búsqueda</h1>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar resultados..."
              className="w-full sm:w-64 pl-8 sm:pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setListView(true)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                listView
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setListView(false)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                !listView
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Resultados */}
      {listView ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedResults.map((item) => (
              <RESULT_ITEM key={item._id} item={item} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-10 flex flex-col items-center space-y-4">
              <p className="text-xs sm:text-sm font-medium">
                Mostrando {(currentPage - 1) * pageSize + 1} –{" "}
                {Math.min(currentPage * pageSize, totalResults)} de{" "}
                {totalResults} resultados
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 sm:p-2 rounded-full ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
                    >
                      1
                    </button>
                    {startPage > 2 && (
                      <span className="text-gray-600 dark:text-gray-300 px-2 text-sm">
                        ...
                      </span>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all text-sm ${
                      currentPage === page
                        ? "bg-blue-700 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && (
                      <span className="text-gray-600 dark:text-gray-300 px-2 text-sm">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 sm:p-2 rounded-full ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <MapComponent results={paginatedResults} coordinates={coordinates} />
      )}
    </div>
  );
}

function MapComponent({
  results,
  coordinates,
}: {
  results: IpsResponse[];
  coordinates: [number, number];
}) {
  const router = useRouter();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: coordinates,
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    results.forEach((item) => {
      if (item.location?.coordinates?.length === 2) {
        const [lng, lat] = item.location.coordinates;
        const markerElement = document.createElement("div");
        markerElement.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563EB" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
          </svg>
        `;

        const roundedRating = Math.round(item.averageRating || 0); // Round to the nearest integer for the map popup
        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs text-sm">
            <h3 class="text-blue-600 font-semibold mb-1 cursor-pointer hover:underline">${
              item.name
            }</h3>
            <p class="text-gray-700">${item.address}, ${item.town ?? ""}, ${
              item.department ?? ""
            }</p>
            <p class="text-gray-700">Distancia: ${
              item.distance !== undefined
                ? Math.round(item.distance) + " metros"
                : "N/A"
            }</p>
            <div class="flex items-center space-x-1 mt-1">
              ${[...Array(roundedRating)]
                .map(
                  () =>
                    `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
                )
                .join("")}
              ${[...Array(5 - roundedRating)]
                .map(
                  () =>
                    `<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
                )
                .join("")}
              <span class="ml-1 text-gray-600">(${roundedRating})</span>
            </div>
          </div>
        `;
        popupContent.querySelector("h3")?.addEventListener("click", () => {
          router.push(`/ips-details/${encodeURIComponent(item.name)}`);
        });

        new mapboxgl.Marker({ element: markerElement })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)
          )
          .addTo(map);
      }
    });

    map.on("load", () => map.resize());
    return () => map.remove();
  }, [results, coordinates, router]);

  return (
    <div
      id="map"
      className="w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-xl shadow-lg overflow-hidden"
    />
  );
}

export default function ResultsPage({
  specialties,
  eps,
}: SearchFormClientProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 text-lg mt-4">
            Cargando datos iniciales...
          </p>
        </div>
      }
    >
      <ResultsDisplay specialties={specialties} eps={eps} />
    </Suspense>
  );
}