"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Hospital, ChevronLeft, ChevronRight, Home } from "lucide-react";
import mapboxgl from "mapbox-gl";
import SearchFormClient, { SearchFormSubmitHandler } from "./SearchFormClient";
import { SearchFormClientProps } from "@/services/search_ips/data_caching.service";
import { Suspense } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

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
  specialties?: any[];
  eps?: any[];
  maps?: string;
  waze?: string;
}

function ResultsDisplay({ specialties, eps }: SearchFormClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [_ALL_RESULTS, setAllResults] = useState<IpsResponse[]>([]);
  const [_PAGINATED_RESULTS, setPaginatedResults] = useState<IpsResponse[]>([]);
  const [_LOADING, setLoading] = useState(true);
  const [_SEARCH_LOADING, setSearchLoading] = useState(false);
  const [_ERROR, setError] = useState<string | null>(null);
  const [_LIST_VIEW, setListView] = useState(true);
  const [_CURRENT_PAGE, setCurrentPage] = useState(1);
  const _PAGE_SIZE = 21;
  const [_TOTAL_RESULTS, setTotalResults] = useState(0);
  const [_TOTAL_PAGES, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchFilteredResults = async () => {
      try {
        const maxDistance = searchParams.get("max_distance") ?? "20000";
        const specialtiesParam =
          searchParams.get("specialties")?.split(",").filter(Boolean) || [];
        const epsParam = searchParams.get("eps")?.split(",").filter(Boolean) || [];
        const coordinatesStr = searchParams.get("coordinates");
        let coordinates: [number, number] = [-75.5849, 6.1816];
        if (coordinatesStr) {
          const [lng, lat] = coordinatesStr.split(",").map(Number);
          if (!isNaN(lng) && !isNaN(lat)) coordinates = [lng, lat];
        }

        const isUnfilteredSearch = specialtiesParam.length === 0 && epsParam.length === 0;

        const response = await fetch("/api/search_ips/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates,
            max_distance: parseInt(maxDistance),
            specialties: isUnfilteredSearch ? undefined : specialtiesParam,
            eps: isUnfilteredSearch ? undefined : epsParam,
            page: 1,
            page_size: 2890,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch filtered results");

        const data = await response.json();
        const filteredResults = data.data || [];
        setAllResults(filteredResults);
        setTotalResults(filteredResults.length);
        setTotalPages(Math.ceil(filteredResults.length / _PAGE_SIZE));

        const pageFromParams = parseInt(searchParams.get("page") ?? "1");
        setCurrentPage(pageFromParams);
        const start = (pageFromParams - 1) * _PAGE_SIZE;
        const end = start + _PAGE_SIZE;
        setPaginatedResults(filteredResults.slice(start, end));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchFilteredResults();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > _TOTAL_PAGES) return;
    setCurrentPage(newPage);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`/results?${currentParams.toString()}`);
    const start = (newPage - 1) * _PAGE_SIZE;
    const end = start + _PAGE_SIZE;
    setPaginatedResults(_ALL_RESULTS.slice(start, end));
  };

  const _MAX_VISIBLE_PAGES = 5;
  const _PAGE_RANGE = Math.floor(_MAX_VISIBLE_PAGES / 2);
  let startPage = Math.max(1, _CURRENT_PAGE - _PAGE_RANGE);
  let endPage = Math.min(_TOTAL_PAGES, startPage + _MAX_VISIBLE_PAGES - 1);
  if (endPage - startPage + 1 < _MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - _MAX_VISIBLE_PAGES + 1);
  }
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleSearchSubmit: SearchFormSubmitHandler = (isSubmitting) => {
    setSearchLoading(isSubmitting);
  };

  if (_LOADING || _SEARCH_LOADING) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 text-lg mt-4">Cargando resultados...</p>
      </div>
    );
  }

  if (_ERROR) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{_ERROR}</p>
      </div>
    );
  }

  const coordinatesStr = searchParams.get("coordinates");
  let coordinates: [number, number] = [-75.5849, 6.1816];
  if (coordinatesStr) {
    const [lng, lat] = coordinatesStr.split(",").map(Number);
    if (!isNaN(lng) && !isNaN(lat)) coordinates = [lng, lat];
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
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
        <h1 className="text-3xl font-bold text-gray-800">
          Resultados de Búsqueda
        </h1>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <button
            onClick={() => setListView(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              _LIST_VIEW
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setListView(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !_LIST_VIEW
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {_LIST_VIEW ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {_PAGINATED_RESULTS.map((item) => (
              <Link
                key={item._id}
                href={`/ips-details/${encodeURIComponent(item.name)}`}
                className="block p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <Hospital className="w-10 h-10 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {item.address}
                      {item.town && `, ${item.town}`}
                      {item.department && `, ${item.department}`}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Distancia:{" "}
                      {item.distance !== undefined
                        ? `${Math.round(item.distance)} m`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {_TOTAL_PAGES > 1 && (
            <div className="mt-10 flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-600 font-medium">
                Mostrando {(_CURRENT_PAGE - 1) * _PAGE_SIZE + 1} –{" "}
                {Math.min(_CURRENT_PAGE * _PAGE_SIZE, _TOTAL_RESULTS)} de{" "}
                {_TOTAL_RESULTS} resultados
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(_CURRENT_PAGE - 1)}
                  disabled={_CURRENT_PAGE === 1}
                  aria-label="Página anterior"
                  title="Página anterior"
                  className={`p-2 rounded-full transition-all duration-200 ${
                    _CURRENT_PAGE === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      1
                    </button>
                    {startPage > 2 && (
                      <span className="text-gray-600 px-2">...</span>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                      _CURRENT_PAGE === page
                        ? "bg-blue-700 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {endPage < _TOTAL_PAGES && (
                  <>
                    {endPage < _TOTAL_PAGES - 1 && (
                      <span className="text-gray-600 px-2">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(_TOTAL_PAGES)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      {_TOTAL_PAGES}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(_CURRENT_PAGE + 1)}
                  disabled={_CURRENT_PAGE === _TOTAL_PAGES}
                  aria-label="Página siguiente"
                  title="Página siguiente"
                  className={`p-2 rounded-full transition-all duration-200 ${
                    _CURRENT_PAGE === _TOTAL_PAGES
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <MapComponent results={_ALL_RESULTS} coordinates={coordinates} />
      )}
    </div>
  );
}

const MapComponent = ({
  results,
  coordinates,
}: {
  results: IpsResponse[];
  coordinates: [number, number];
}) => {
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

    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.enable();

    results.forEach((item) => {
      if (item.location?.coordinates?.length === 2) {
        const [lng, lat] = item.location.coordinates;
        const markerElement = document.createElement("div");
        markerElement.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
          </svg>
        `;

        const popupContent = document.createElement("div");
        popupContent.className = "popup-content";
        popupContent.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs border border-gray-200">
            <h3 class="text-base font-semibold text-blue-600 cursor-pointer hover:underline mb-1">${item.name}</h3>
            <p class="text-sm text-gray-600">${item.address}, ${item.town ?? ""}, ${item.department ?? ""}</p>
            <p class="text-xs text-gray-500 mt-1">Distancia: ${item.distance !== undefined ? `${Math.round(item.distance)} m` : "N/A"}</p>
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

    map.on("load", () => map.resize());
    return () => map.remove();
  }, [results, coordinates, router]);

  return (
    <div
      id="map"
      className="w-full h-[400px] sm:h-[600px] rounded-xl shadow-lg overflow-hidden"
    />
  );
};

export default function ResultsPage({ specialties, eps }: SearchFormClientProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 text-lg mt-4">Cargando datos iniciales...</p>
        </div>
      }
    >
      <ResultsDisplay specialties={specialties} eps={eps} />
    </Suspense>
  );
}