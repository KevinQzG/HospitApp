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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import SearchFormClient, {
  SearchFormSubmitHandler,
} from "./SearchFormClient";
import { SearchFormClientProps } from "@/services/cachers/data_caching.service";
import { Suspense } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

// Define SortField type
type SortField = { field: string; direction: number };

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
  rating?: number;
  totalReviews: number;
  promotion?: number;
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

interface SearchRequestBody {
  coordinates: [number, number];
  maxDistance: number;
  page: number;
  pageSize: number;
  specialties?: string[];
  epsNames?: string[];
  sorts?: { field: string; direction: number }[];
}

// Star Rating Component with Tooltip
const StarRating = ({ rating }: { rating: number }) => {
  const roundedRating = Math.round(rating);
  const formattedRating = Number.isInteger(rating)
    ? rating
    : rating.toFixed(1);

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
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
        {formattedRating} de 5
      </div>
    </div>
  );
};

// Helper function to check if an item is promoted
const isPromoted = (promotion?: number) =>
  promotion !== undefined && promotion >= 1 && promotion <= 5;

const RESULT_ITEM = memo(({ item }: { item: IpsResponse }) => {
  const promoted = isPromoted(item.promotion);

  return (
    <Link
      href={`/ips-details/${encodeURIComponent(item.name)}`}
      aria-label={`Ver detalles de ${item.name}`}
      className={`block p-4 rounded-2xl transition-all duration-300 border h-40 flex flex-col ${
        promoted
          ? "bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200/50 dark:border-amber-700/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] backdrop-blur-sm"
          : "bg-white/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] backdrop-blur-sm"
      }`}
    >
      <div className="flex items-start space-x-3 flex-1">
        <div
          className={`p-2.5 rounded-xl flex-shrink-0 ${
            promoted
              ? "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-800/30 dark:to-yellow-800/30"
              : "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
          }`}
        >
          <Hospital
            className={`w-5 h-5 ${
              promoted
                ? "text-amber-600 dark:text-amber-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              {item.name}
            </h2>
            {promoted && (
              <span
                className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-800/30 dark:to-yellow-800/30 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm"
                aria-label="IPS destacada por promoción"
              >
                Destacado
              </span>
            )}
          </div>
          <div className="group flex items-center space-x-1.5 mt-1">
            <MapPin
              className={`w-4 h-4 ${
                promoted
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-blue-500 dark:text-blue-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                promoted
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {item.distance !== undefined
                ? `${Math.round(item.distance)} metros`
                : "N/A"}
            </p>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800/90 text-white text-xs rounded-lg py-1.5 px-3 backdrop-blur-sm">
              Distancia desde tu ubicación actual
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
            {item.address}
            {item.town && `, ${item.town}`}
            {item.department && `, ${item.department}`}
          </p>
          <div className="mt-1.5">
            {item.totalReviews && item.totalReviews > 0 ? (
              <StarRating rating={item.rating || 0} />
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Sin reseñas
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

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
  const [sortFields, setSortFields] = useState<SortField[]>([]);

  const sortOptions = [
    { value: "distance", label: "Distancia" },
    { value: "rating", label: "Calificación" },
    { value: "name", label: "Nombre" },
  ];

  // Handlers for sort fields
  const addSortField = () => {
    const availableFields = sortOptions
      .filter((opt) => !sortFields.some((sf) => sf.field === opt.value))
      .map((opt) => opt.value);
    if (availableFields.length > 0) {
      const newSortFields = [
        ...sortFields,
        { field: availableFields[0], direction: 1 },
      ];
      setSortFields(newSortFields);
      updateSortQuery(newSortFields);
    }
  };

  const removeSortField = (index: number) => {
    const newSortFields = sortFields.filter((_, i) => i !== index);
    setSortFields(newSortFields);
    updateSortQuery(newSortFields);
  };

  const handleFieldChange = (index: number, field: string) => {
    const newSortFields = [...sortFields];
    newSortFields[index].field = field;
    setSortFields(newSortFields);
    updateSortQuery(newSortFields);
  };

  const handleDirectionChange = (index: number, direction: number) => {
    const newSortFields = [...sortFields];
    newSortFields[index].direction = direction;
    setSortFields(newSortFields);
    updateSortQuery(newSortFields);
  };

  // Update URL with new sort fields
  const updateSortQuery = (newSortFields: SortField[]) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (newSortFields.length > 0) {
      const sorts = newSortFields
        .filter((sf) => sf.field)
        .map((sf) => `${sf.field}:${sf.direction}`)
        .join(",");
      currentParams.set("sorts", sorts);
    } else {
      currentParams.delete("sorts");
    }
    currentParams.set("page", "1");
    router.push(`/results?${currentParams.toString()}`, { scroll: false });
  };

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
        const sortsParam = searchParams.get("sorts");
        let sorts: SortField[] = [];
        if (sortsParam) {
          sorts = sortsParam
            .split(",")
            .map((pair) => {
              const [field, direction] = pair.split(":");
              return { field, direction: parseInt(direction) };
            })
            .filter((sf) => sf.field && !isNaN(sf.direction));
          setSortFields(sorts);
        } else {
          setSortFields([]);
        }

        const maxDistance = searchParams.get("maxDistance") ?? "20000";
        const specialtiesParam =
          searchParams.get("specialties")?.split(",").filter(Boolean) || [];
        const epsParam =
          searchParams.get("epsNames")?.split(",").filter(Boolean) || [];
        const coordinatesStr = searchParams.get("coordinates");
        let coordinates: [number, number] = userCoordinates || [
          -75.5849,
          6.1816,
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

        if (sorts.length > 0) {
          requestBody.sorts = sorts;
        }

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
        const FILTERED_RESULTS = data.data || [];

        setAllResults(FILTERED_RESULTS);
        setTotalResults(FILTERED_RESULTS.length);
        setTotalPages(Math.ceil(FILTERED_RESULTS.length / pageSize));

        if (isNewSearch) {
          setCurrentPage(1);
          setIsNewSearch(false);
        } else {
          const pageFromParams = parseInt(searchParams.get("page") ?? "1");
          setCurrentPage(pageFromParams);
        }

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setPaginatedResults(FILTERED_RESULTS.slice(start, end));
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
    const filtered = allResults.filter((item) =>
      `${item.name} ${item.address} ${item.town || ""} ${
        item.department || ""
      }`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setTotalResults(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedResults(filtered.slice(start, end));
  }, [searchQuery, allResults, currentPage]);

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
    <div className="p-3 sm:p-5 max-w-7xl mx-auto bg-[#ECF6FF] dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden">
      <Link
        href="/"
        className="inline-flex items-center mb-4 sm:mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
      >
        <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
        <span className="text-sm sm:text-base font-semibold">
          Volver al Inicio
        </span>
      </Link>

      <div className="mb-5 sm:mb-8">
        <SearchFormClient
          specialties={specialties}
          eps={eps}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CTA of Promoción */}
          <Link
            href="/promotion-form"
            className="block bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-[1.01]"
          >
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">
                ¿Quieres destacar tu IPS?
              </h2>
              <p className="text-xs text-blue-100 dark:text-blue-200 mb-3 leading-relaxed">
                Promociona tu IPS y atrae más pacientes.
              </p>
              <span className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded-full hover:bg-blue-50 transition-colors duration-200 shadow-sm">
                Promocionar IPS
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>

          {/* CTA for Solicitar Registro de IPS */}
          <Link
            href="/adition-form"
            className="block bg-gradient-to-r from-green-600 to-green-800 dark:from-green-700 dark:to-green-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-[1.01]"
          >
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">
                ¿Tu IPS no está registrada?
              </h2>
              <p className="text-xs text-green-100 dark:text-green-200 mb-3 leading-relaxed">
                Registra tu IPS para que te encuentren.
              </p>
              <span className="inline-flex items-center px-4 py-2 bg-white text-green-600 font-medium text-sm rounded-full hover:bg-green-50 transition-colors duration-200 shadow-sm">
                Solicitar Registro
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3">
          Resultados de Búsqueda
        </h1>
        <div className="flex flex-col gap-3">
          {/* Filter Controls (Sort Fields and Add Filter Button) */}
          <div className="flex flex-row items-center gap-2 overflow-x-auto pb-2">
            {sortFields.map((sortField, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm transition-all duration-300 hover:shadow-md flex-shrink-0"
              >
                <select
                  value={sortField.field}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="">Seleccionar Filtro</option>
                  {sortOptions
                    .filter(
                      (opt) =>
                        !sortFields.some(
                          (sf, i) => sf.field === opt.value && i !== index
                        )
                    )
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDirectionChange(index, 1)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      sortField.direction === 1
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    aria-label="Ordenar ascendente"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDirectionChange(index, -1)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      sortField.direction === -1
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    aria-label="Ordenar descendente"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSortField(index)}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200"
                  aria-label="Eliminar filtro"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {sortFields.length < sortOptions.length && (
              <button
                type="button"
                onClick={addSortField}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-2 flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Agregar Filtro</span>
              </button>
            )}
          </div>
          {/* Search Input and View Toggle Buttons */}
          <div className="flex flex-row items-center gap-3 justify-end">
            <div className="relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por nombre..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setListView(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  listView
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setListView(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  !listView
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Mapa
              </button>
            </div>
          </div>
        </div>
      </div>

      {listView ? (
        !loading && !searchLoading && paginatedResults.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No hay resultados para esta búsqueda
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {paginatedResults.map((item) => (
                <RESULT_ITEM key={item._id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex flex-col items-center space-y-3">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostrando {(currentPage - 1) * pageSize + 1} –{" "}
                  {Math.min(currentPage * pageSize, totalResults)} de{" "}
                  {totalResults} resultados
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2">
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
                          ? "bg-blue-600 text-white shadow-md"
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
        )
      ) : !loading && !searchLoading && allResults.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
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

        const roundedRating = Math.round(item.rating || 0);
        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs text-sm">
            <h3 class="text-blue-600 font-semibold mb-1 cursor-pointer hover:underline">${item.name}</h3>
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
                item.totalReviews > 0
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
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
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
      className="w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-xl shadow-lg overflow-hidden max-w-full border border-gray-200 dark:border-gray-700"
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