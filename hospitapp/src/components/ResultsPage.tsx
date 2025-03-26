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
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
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

// Función para calcular la distancia en metros usando la fórmula de Haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en metros
}

// Componente memoizado para renderizar cada resultado y evitar re-renderizados innecesarios
const ResultItem = memo(({ item }: { item: IpsResponse }) => (
  <Link
    href={`/ips-details/${encodeURIComponent(item.name)}`}
    className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center space-x-4">
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <Hospital className="w-10 h-10 text-blue-700 dark:text-blue-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {item.address}
          {item.town && `, ${item.town}`}
          {item.department && `, ${item.department}`}
        </p>
        <p className="text-gray-800 dark:text-gray-200 text-ms mt-1">
          Distancia:{" "}
          {item.distance !== undefined
            ? `${Math.round(item.distance)} metros`
            : "N/A"}
        </p>
      </div>
    </div>
  </Link>
));

ResultItem.displayName = "ResultItem";

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
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [isNewSearch, setIsNewSearch] = useState(false);

  // Obtener la ubicación del usuario al montar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates([position.coords.longitude, position.coords.latitude]);
        },
        (err) => {
          console.warn("No se pudo obtener la ubicación del usuario:", err);
          setUserCoordinates([-75.5849, 6.1816]); // Coordenadas por defecto
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.warn("Geolocalización no soportada");
      setUserCoordinates([-75.5849, 6.1816]); // Coordenadas por defecto
    }
  }, []);

  // Obtener los resultados filtrados desde el servidor
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
        let coordinates: [number, number] = userCoordinates || [-75.5849, 6.1816];
        if (coordinatesStr) {
          const [lng, lat] = coordinatesStr.split(",").map(Number);
          if (!isNaN(lng) && !isNaN(lat)) coordinates = [lng, lat];
        }

        // Construir el cuerpo de la solicitud para la API
        const requestBody: any = {
          coordinates, // Coordenadas del usuario
          max_distance: parseInt(maxDistance), // Distancia máxima en metros
          page: 1,
          page_size: 2890, // Traer todos los resultados para paginar en el cliente
        };

        // Incluir especialidades solo si se seleccionaron
        if (specialtiesParam.length > 0) {
          requestBody.specialties = specialtiesParam;
        }

        // Incluir EPS solo si se seleccionaron
        if (epsParam.length > 0) {
          requestBody.eps_names = epsParam;
        }

        // Si no se seleccionaron ni especialidades ni EPS, la API debería devolver todos los IPS
        // dentro del rango de distancia y según la ubicación del usuario

        const response = await fetch("/api/search_ips/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error("No se pudieron obtener los resultados filtrados");

        const data: SearchResponse = await response.json();
        let filteredResults = data.data || [];

        // Log para depurar el número de resultados
        console.log("Resultados del servidor:", filteredResults.length);
        console.log("Paginación del servidor:", data.pagination);

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

          // Ordenar los resultados por distancia (ascendente)
          filteredResults.sort((a: IpsResponse, b: IpsResponse) => (a.distance || 0) - (b.distance || 0));
        }

        setAllResults(filteredResults);
        setTotalResults(data.pagination?.total || filteredResults.length);
        setTotalPages(data.pagination?.totalPages || Math.ceil(filteredResults.length / pageSize));

        // Establecer la página actual desde los parámetros de la URL solo si es una nueva búsqueda
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
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
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
      `${item.name} ${item.address} ${item.town || ""} ${item.department || ""}`
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
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
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
    <div className="p-6 max-w-7xl mx-auto bg-[#ECF6FF] dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
      >
        <Home className="w-6 h-6 mr-2" />
        <span className="text-lg font-medium">Volver al Inicio</span>
      </Link>

      <div className="mb-10">
        <SearchFormClient
          specialties={specialties}
          eps={eps}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resultados de Búsqueda</h1>
        <div className="mt-4 sm:mt-0 flex space-x-4 items-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar resultados..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
          </div>
          <button
            onClick={() => setListView(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              listView
                ? "bg-blue-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setListView(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !listView
                ? "bg-blue-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {/* Lista de Resultados */}
      {listView ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.map((item) => (
              <ResultItem key={item._id} item={item} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center space-y-4">
              <p className="text-sm font-medium">
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
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      1
                    </button>
                    {startPage > 2 && <span className="text-gray-600 dark:text-gray-300 px-2">...</span>}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
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
                    {endPage < totalPages - 1 && <span className="text-gray-600 dark:text-gray-300 px-2">...</span>}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
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
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
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

        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs text-sm">
            <h3 class="text-blue-600 font-semibold mb-1 cursor-pointer hover:underline">${item.name}</h3>
            <p class="text-gray-700">${item.address}, ${item.town ?? ""}, ${item.department ?? ""}</p>
            <p class="text-gray-700">Distancia: ${item.distance !== undefined ? Math.round(item.distance) + " metros" : "N/A"}</p>
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
      className="w-full h-[400px] sm:h-[600px] rounded-xl shadow-lg overflow-hidden"
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