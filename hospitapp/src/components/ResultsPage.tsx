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
  MapPin,
  ChevronDown,
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
  distance?: number;
  specialties?: Specialty[];
  eps?: Eps[];
  maps?: string;
  waze?: string;
  averageRating?: number;
  hasReviews?: boolean;
}

interface ReviewResponse {
  _id: string;
  ips: string;
  rating: number;
  userEmail?: string;
  comments?: string;
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
  maxDistance: number;
  page: number;
  pageSize: number;
  specialties?: string[];
  epsNames?: string[];
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

// Star Rating Component with Tooltip
const StarRating = ({ rating }: { rating: number }) => {
  const roundedRating = Math.round(rating);
  const formattedRating = Number.isInteger(rating) ? rating : rating.toFixed(1);

  const fullStars = roundedRating;
  const emptyStars = 5 - fullStars;

  return (
    <div className="group relative flex items-center space-x-1">
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
          className="w-4 h-4 text-gray-300 dark:text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="ml-1 text-gray-600 dark:text-gray-400 text-xs">
        ({formattedRating})
      </span>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">
        {formattedRating} de 5
      </div>
    </div>
  );
};

const RESULT_ITEM = memo(({ item }: { item: IpsResponse }) => (
  <Link
    href={`/ips-details/${encodeURIComponent(item.name)}`}
    className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 h-40 flex flex-col"
  >
    <div className="flex items-start space-x-3 flex-1">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
        <Hospital className="w-6 h-6 text-blue-700 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {item.name}
        </h2>
        <div className="group flex items-center space-x-1 mt-1">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {item.distance !== undefined
              ? `${Math.round(item.distance)} metros`
              : "N/A"}
          </p>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">
            Distancia desde tu ubicación actual
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
          {item.address}
          {item.town && `, ${item.town}`}
          {item.department && `, ${item.department}`}
        </p>
        <div className="mt-1">
          {item.hasReviews ? (
            <StarRating rating={item.averageRating || 0} />
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Sin reseñas
            </p>
          )}
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
  const [sortOption, setSortOption] = useState<
    "distance" | "rating-desc" | "name-asc" | "name-desc"
  >("distance");
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
          setUserCoordinates([-75.5849, 6.1816]);
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
        const maxDistance = searchParams.get("maxDistance") ?? "20000";
        const specialtiesParam =
          searchParams.get("specialties")?.split(",").filter(Boolean) || [];
        const epsParam =
          searchParams.get("epsNames")?.split(",").filter(Boolean) || [];
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
          maxDistance: parseInt(maxDistance),
          page: 1,
          pageSize: 2890,
        };

        if (specialtiesParam.length > 0) {
          requestBody.specialties = specialtiesParam;
        }

        if (epsParam.length > 0) {
          requestBody.epsNames = epsParam;
        }

        const response = await fetch("/api/v1.0.0/ips/filter/pagination", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok)
          throw new Error("No se pudieron obtener los resultados filtrados");

        const data: SearchResponse = await response.json();
        let filteredResults = data.data || [];

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
          } else {
            console.error("Error al obtener reseñas:", reviewsData.error);
          }
        } else {
          console.error(
            "Error en la respuesta de la API de reseñas:",
            reviewsResponse.status
          );
        }

        filteredResults = filteredResults.map((item: IpsResponse) => {
          const ipsReviews = allReviews.filter(
            (review) => review.ips === item._id
          );
          const averageRating =
            ipsReviews.length > 0
              ? ipsReviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                ) / ipsReviews.length
              : 0;
          const hasReviews = ipsReviews.length > 0;
          return { ...item, averageRating, hasReviews };
        });

        if (userCoordinates) {
          filteredResults = filteredResults.map((item: IpsResponse) => ({
            ...item,
            distance: calculateDistance(
              userCoordinates[1],
              userCoordinates[0],
              item.location.coordinates[1],
              item.location.coordinates[0]
            ),
          }));
        }

        setAllResults(filteredResults);
        setTotalResults(filteredResults.length);
        setTotalPages(Math.ceil(filteredResults.length / pageSize));

        if (isNewSearch) {
          setCurrentPage(1);
          setIsNewSearch(false);
        } else {
          const pageFromParams = parseInt(searchParams.get("page") ?? "1");
          setCurrentPage(pageFromParams);
        }
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

  useEffect(() => {
    let filtered = allResults.filter((item) =>
      `${item.name} ${item.address} ${item.town || ""} ${item.department || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === "distance") {
        return (a.distance || 0) - (b.distance || 0);
      } else if (sortOption === "rating-desc") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      } else if (sortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    setTotalResults(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedResults(filtered.slice(start, end));
  }, [searchQuery, allResults, currentPage, sortOption]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`/results?${currentParams.toString()}`, { scroll: false });
  };

  const handleSearchSubmit: SearchFormSubmitHandler = (isSubmitting) => {
    setSearchLoading(isSubmitting);
    if (isSubmitting) {
      setIsNewSearch(true);
    }
  };

  const sortOptions = [
    { value: "distance", label: "Distancia (Más cerca)" },
    { value: "rating-desc", label: "Calificación (Mayor)" },
    { value: "name-asc", label: "Nombre (A-Z)" },
    { value: "name-desc", label: "Nombre (Z-A)" },
  ];

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
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-blue-300 border-t-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-4 font-medium">
          Buscando los mejores resultados...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-red-500 text-lg font-medium">{error}</p>
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden">
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
      >
        <Home className="w-5 h-5 mr-2" />
        <span className="text-sm font-semibold">Volver al Inicio</span>
      </Link>

      <div className="mb-8">
        <SearchFormClient
          specialties={specialties}
          eps={eps}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Resultados de Búsqueda</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar resultados..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all duration-200"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="relative w-full sm:w-56">
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value as
                    | "distance"
                    | "rating-desc"
                    | "name-asc"
                    | "name-desc"
                )
              }
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-gray-800 dark:text-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none transition-all duration-200"
              aria-label="Ordenar resultados"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setListView(true)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
                listView
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setListView(false)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
                !listView
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Mapa
            </button>
          </div>
        </div>
      </div>

      {listView ? (
        !loading && !searchLoading && paginatedResults.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              No hay resultados para esta búsqueda
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedResults.map((item) => (
                <RESULT_ITEM key={item._id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Mostrando {(currentPage - 1) * pageSize + 1} –{" "}
                  {Math.min(currentPage * pageSize, totalResults)} de{" "}
                  {totalResults} resultados
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } transition-all`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {startPage > 1 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm"
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
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } transition-all`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : !loading && !searchLoading && allResults.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            No hay resultados para esta búsqueda
          </p>
        </div>
      ) : (
        <MapComponent results={allResults} coordinates={coordinates} />
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
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const initialStyle = darkModeMediaQuery.matches
      ? "mapbox://styles/mapbox/dark-v10"
      : "mapbox://styles/mapbox/streets-v12";

    const map = new mapboxgl.Map({
      container: "map",
      style: initialStyle,
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

        const roundedRating = Math.round(item.averageRating || 0);
        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs text-sm">
            <h3 class="text-blue-600 font-semibold mb-1 cursor-pointer hover:underline">${
              item.name
            }</h3>
            <div class="flex items-center space-x-1 mb-1">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/></svg>
              <p class="text-blue-600 font-medium">${
                item.distance !== undefined
                  ? Math.round(item.distance) + " metros"
                  : "N/A"
              }</p>
            </div>
            <p class="text-gray-700 dark:text-gray-300">${item.address}, ${
          item.town ?? ""
        }, ${item.department ?? ""}</p>
            <div class="flex items-center space-x-1 mt-1">
              ${
                item.hasReviews
                  ? `
                    ${[...Array(roundedRating)]
                      .map(
                        () =>
                          `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
                      )
                      .join("")}
                    ${[...Array(5 - roundedRating)]
                      .map(
                        () =>
                          `<svg class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
                      )
                      .join("")}
                    <span class="ml-1 text-gray-600 dark:text-gray-400">(${roundedRating})</span>
                  `
                  : `<span class="text-gray-600 dark:text-gray-400 italic">Sin reseñas</span>`
              }
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

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      map.setStyle(
        e.matches
          ? "mapbox://styles/mapbox/dark-v10"
          : "mapbox://styles/mapbox/streets-v12"
      );
    };
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    map.on("load", () => map.resize());

    return () => {
      map.remove();
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, [results, coordinates, router]);

  return (
    <div
      id="map"
      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-xl shadow-lg overflow-hidden max-w-full border border-gray-200 dark:border-gray-700"
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
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-blue-300 border-t-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mt-4 font-medium">
            Cargando datos iniciales...
          </p>
        </div>
      }
    >
      <ResultsDisplay specialties={specialties} eps={eps} />
    </Suspense>
  );
}