"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Hospital } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { SearchResponse } from "../api/search_ips/filter/route";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface IpsResponse {
  _id: string;
  name: string;
  address: string;
  town?: string;
  department?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  phone?: string | number;
  email?: string;
  level?: number;
  distance?: number;
  specialties?: any[];
  eps?: any[];
  maps?: string;
  waze?: string;
}

function ResultsPageContent() {
  const _SEARCH_PARAMS = useSearchParams();
  const _ROUTER = useRouter();
  const [_ALL_RESULTS, _SET_ALL_RESULTS] = useState<IpsResponse[]>([]);
  const [_PAGINATED_RESULTS, _SET_PAGINATED_RESULTS] = useState<IpsResponse[]>([]);
  const [_LOADING, _SET_LOADING] = useState(true);
  const [_ERROR, _SET_ERROR] = useState<string | null>(null);
  const [_LIST_VIEW, _SET_LIST_VIEW] = useState(true);
  const [_CURRENT_PAGE, _SET_CURRENT_PAGE] = useState(1);
  const _PAGE_SIZE = 21;
  const [_TOTAL_RESULTS, _SET_TOTAL_RESULTS] = useState(0);
  const [_TOTAL_PAGES, _SET_TOTAL_PAGES] = useState(0);

  useEffect(() => {
    const _FETCH_FILTERED_RESULTS = async () => {
      try {
        const _MAX_DISTANCE = _SEARCH_PARAMS.get("max_distance") || "10000";
        const _SPECIALTIES =
          _SEARCH_PARAMS.get("specialties")?.split(",").filter(Boolean) || [];
        const _EPS = _SEARCH_PARAMS.get("eps")?.split(",").filter(Boolean) || [];
        const _COORDINATES_STR = _SEARCH_PARAMS.get("coordinates");
        let _COORDINATES: [number, number] = [-75.5849, 6.1816];
        if (_COORDINATES_STR) {
          const [_LNG, _LAT] = _COORDINATES_STR.split(",").map(Number);
          if (!isNaN(_LNG) && !isNaN(_LAT)) {
            _COORDINATES = [_LNG, _LAT];
          }
        }

        const _IS_UNFILTERED_SEARCH = _SPECIALTIES.length === 0 && _EPS.length === 0;

        const _RESPONSE = await fetch("/api/search_ips/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: _COORDINATES,
            max_distance: parseInt(_MAX_DISTANCE),
            specialties: _IS_UNFILTERED_SEARCH ? undefined : _SPECIALTIES,
            eps: _IS_UNFILTERED_SEARCH ? undefined : _EPS,
            page: 1,
            page_size: 2890,
          }),
        });

        if (!_RESPONSE.ok) {
          throw new Error("Failed to fetch filtered results");
        }

        const _DATA = await _RESPONSE.json();
        const _FILTERED_RESULTS = _DATA.data || [];
        _SET_ALL_RESULTS(_FILTERED_RESULTS);
        _SET_TOTAL_RESULTS(_FILTERED_RESULTS.length);
        _SET_TOTAL_PAGES(Math.ceil(_FILTERED_RESULTS.length / _PAGE_SIZE));

        const _PAGE_FROM_PARAMS = parseInt(_SEARCH_PARAMS.get("page") || "1");
        _SET_CURRENT_PAGE(_PAGE_FROM_PARAMS);
        const _START = (_PAGE_FROM_PARAMS - 1) * _PAGE_SIZE;
        const _END = _START + _PAGE_SIZE;
        _SET_PAGINATED_RESULTS(_FILTERED_RESULTS.slice(_START, _END));
      } catch (_ERR) {
        _SET_ERROR(_ERR instanceof Error ? _ERR.message : "Unknown error occurred");
      } finally {
        _SET_LOADING(false);
      }
    };

    _FETCH_FILTERED_RESULTS();
  }, [_SEARCH_PARAMS]);

  const _HANDLE_PAGE_CHANGE = (_NEW_PAGE: number) => {
    _SET_CURRENT_PAGE(_NEW_PAGE);
    const _CURRENT_PARAMS = new URLSearchParams(_SEARCH_PARAMS.toString());
    _CURRENT_PARAMS.set("page", _NEW_PAGE.toString());
    _ROUTER.push(`/results?${_CURRENT_PARAMS.toString()}`);
    const _START = (_NEW_PAGE - 1) * _PAGE_SIZE;
    const _END = _START + _PAGE_SIZE;
    _SET_PAGINATED_RESULTS(_ALL_RESULTS.slice(_START, _END));
  };

  if (_LOADING) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
          <p className="text-xl font-medium text-gray-700 animate-fade-in">
            Buscando resultados...
          </p>
        </div>
      </div>
    );
  }

  if (_ERROR) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-center text-red-500 text-lg">
          Error: {_ERROR || "Unknown error"}
        </p>
      </div>
    );
  }

  const _COORDINATES_STR = _SEARCH_PARAMS.get("coordinates");
  let _COORDINATES: [number, number] = [-75.5849, 6.1816];
  if (_COORDINATES_STR) {
    const [_LNG, _LAT] = _COORDINATES_STR.split(",").map(Number);
    if (!isNaN(_LNG) && !isNaN(_LAT)) {
      _COORDINATES = [_LNG, _LAT];
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Resultados de Búsqueda de IPS
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => _SET_LIST_VIEW(true)}
            className={`px-4 py-2 rounded ${
              _LIST_VIEW ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => _SET_LIST_VIEW(false)}
            className={`px-4 py-2 rounded ${
              !_LIST_VIEW ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {_LIST_VIEW ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {_PAGINATED_RESULTS.map((_ITEM) => (
              <Link
                key={_ITEM._id}
                href={`/ips-details/${encodeURIComponent(_ITEM.name)}`}
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="relative flex items-center justify-center h-20 bg-blue-50 mb-4">
                  <Hospital className="w-12 h-12 text-blue-500" />
                </div>
                <div className="p-2">
                  <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    {_ITEM.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {_ITEM.address} {_ITEM.town && `, ${_ITEM.town}`}{" "}
                    {_ITEM.department && `, ${_ITEM.department}`}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Distancia:{" "}
                    {_ITEM.distance !== undefined
                      ? `${Math.round(_ITEM.distance)} metros`
                      : "No disponible"}
                  </p>
                  <button className="mt-4 w-full bg-blue-500 text-white text-sm py-2 rounded hover:bg-blue-600">
                    Más información
                  </button>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => _HANDLE_PAGE_CHANGE(_CURRENT_PAGE - 1)}
              disabled={_CURRENT_PAGE === 1}
              className={`px-4 py-2 rounded ${
                _CURRENT_PAGE === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {_CURRENT_PAGE} de {_TOTAL_PAGES}
            </span>
            <button
              onClick={() => _HANDLE_PAGE_CHANGE(_CURRENT_PAGE + 1)}
              disabled={_CURRENT_PAGE === _TOTAL_PAGES}
              className={`px-4 py-2 rounded ${
                _CURRENT_PAGE === _TOTAL_PAGES
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[calc(100vh-150px)] md:h-[600px]">
          <MapComponent results={_ALL_RESULTS} coordinates={_COORDINATES} />
        </div>
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
  const _ROUTER = useRouter();

  useEffect(() => {
    const _MAP = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/navigation-day-v1",
      center: coordinates,
      zoom: 12,
    });

    _MAP.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    _MAP.addControl(new mapboxgl.FullscreenControl(), "top-right");
    _MAP.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    _MAP.scrollZoom.disable();
    _MAP.doubleClickZoom.disable();
    _MAP.touchZoomRotate.enable();

    results.forEach((_ITEM) => {
      if (
        _ITEM.location &&
        _ITEM.location.coordinates &&
        _ITEM.location.coordinates.length === 2
      ) {
        const [_LONGITUDE, _LATITUDE] = _ITEM.location.coordinates;
        const _LAT = parseFloat(String(_LATITUDE));
        const _LNG = parseFloat(String(_LONGITUDE));

        if (
          !isNaN(_LAT) &&
          !isNaN(_LNG) &&
          _LAT >= -90 &&
          _LAT <= 90 &&
          _LNG >= -180 &&
          _LNG <= 180
        ) {
          const _MARKER_ELEMENT = document.createElement("div");
          _MARKER_ELEMENT.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
            </svg>
          `;

          const _POPUP_CONTENT = document.createElement("div");
          _POPUP_CONTENT.className = "popup-content";
          _POPUP_CONTENT.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs border border-gray-200">
              <h3 class="text-base font-semibold text-blue-600 cursor-pointer hover:underline mb-1">${_ITEM.name}</h3>
              <p class="text-sm text-gray-600">${_ITEM.address}, ${_ITEM.town || ""}, ${_ITEM.department || ""}</p>
              <p class="text-xs text-gray-500 mt-1">Distancia: ${_ITEM.distance !== undefined ? `${Math.round(_ITEM.distance)} m` : "N/A"}</p>
            </div>
          `;
          _POPUP_CONTENT.querySelector("h3")?.addEventListener("click", () => {
            _ROUTER.push(`/ips-details/${encodeURIComponent(_ITEM.name)}`);
          });

          new mapboxgl.Marker({ element: _MARKER_ELEMENT })
            .setLngLat([_LNG, _LAT])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(_POPUP_CONTENT))
            .addTo(_MAP);
        } else {
          console.warn(
            `Coordenadas inválidas para ${_ITEM.name}: lat=${_LAT}, lng=${_LNG}`
          );
        }
      } else {
        console.warn(`Location o coordinates inválidos para ${_ITEM.name}`);
      }
    });

    _MAP.on("load", () => {
      _MAP.resize();
    });

    return () => _MAP.remove();
  }, [results, _ROUTER, coordinates]);

  return <div id="map" className="w-full h-full rounded-xl shadow-lg overflow-hidden" />;
};

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResultsPageContent />
    </Suspense>
  );
}