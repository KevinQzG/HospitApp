"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Landmark, Home, ArrowLeft } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface IpsDetailClientProps {
  ipsData: NonNullable<LookIpsResponse["data"]>;
}

export default function IpsDetailClient({ ipsData }: IpsDetailClientProps) {
  const _ROUTER = useRouter();
  const [_VIEW_MODE, _SET_VIEW_MODE] = useState<"details" | "map">("details");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a resultados
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{ipsData.name}</h1>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <button
              onClick={() => _SET_VIEW_MODE("details")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                _VIEW_MODE === "details"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Detalles
            </button>
            <button
              onClick={() => _SET_VIEW_MODE("map")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                _VIEW_MODE === "map"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mapa
            </button>
          </div>
        </div>

        {_VIEW_MODE === "details" ? (
          <_DETAILS_VIEW ipsData={ipsData} />
        ) : (
          <_MAP_VIEW ipsData={ipsData} router={_ROUTER} />
        )}
      </main>
    </div>
  );
}

const _DETAILS_VIEW = ({ ipsData }: { ipsData: NonNullable<LookIpsResponse["data"]> }) => (
  <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
    <section className="bg-white rounded-3xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">General Information</h2>
      <ul className="space-y-4 text-gray-600">
        <li className="flex items-center">
          <MapPin size={20} className="mr-3 text-blue-600" />
          <span>
            {ipsData.department}, {ipsData.town}
          </span>
        </li>
        <li className="flex items-center">
          <MapPin size={20} className="mr-3 text-blue-600" />
          <span>{ipsData.address}</span>
        </li>
        {ipsData.phone && (
          <li className="flex items-center">
            <Phone size={20} className="mr-3 text-blue-600" />
            <span>{ipsData.phone}</span>
          </li>
        )}
        {ipsData.email && (
          <li className="flex items-center">
            <Mail size={20} className="mr-3 text-blue-600" />
            <span>{ipsData.email}</span>
          </li>
        )}
        {ipsData.level && (
          <li className="flex items-center">
            <span className="font-medium text-gray-900 mr-2">Level:</span>
            <span>{ipsData.level}</span>
          </li>
        )}
      </ul>
    </section>

    <section className="bg-white rounded-3xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
      <p className="text-gray-600">
        <span className="font-medium text-gray-900">Coordinates:</span>
        <br />
        <span className="text-gray-600">Longitude: {ipsData.location.coordinates[0]}</span>
        <br />
        <span className="text-gray-600">Latitude: {ipsData.location.coordinates[1]}</span>
      </p>
      <div className="mt-4 space-y-2">
        <a
          href={ipsData.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
        >
          View on Google Maps →
        </a>
        <a
          href={ipsData.waze}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
        >
          View on Waze →
        </a>
      </div>
    </section>

    {ipsData.eps && ipsData.eps.length > 0 && (
      <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2 transition-all duration-300 hover:shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accepted EPS</h2>
        <div className="flex flex-wrap gap-2">
          {ipsData.eps.map((eps) => (
            <span
              key={eps._id}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium transition-colors duration-300"
            >
              {eps.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {ipsData.specialties && ipsData.specialties.length > 0 && (
      <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2 transition-all duration-300 hover:shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {ipsData.specialties.map((spec) => (
            <span
              key={spec._id}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium transition-colors duration-300"
            >
              {spec.name}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);

const _MAP_VIEW = ({
  ipsData,
  router,
}: {
  ipsData: NonNullable<LookIpsResponse["data"]>;
  router: ReturnType<typeof useRouter>;
}) => {
  useEffect(() => {
    const [_LNG, _LAT] = ipsData.location.coordinates;
    const _MAP = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [_LNG, _LAT],
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

    const _MARKER_ELEMENT = document.createElement("div");
    _MARKER_ELEMENT.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
      </svg>
    `;

    const _POPUP_CONTENT = document.createElement("div");
    _POPUP_CONTENT.className = "popup-content";
    _POPUP_CONTENT.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-xs border border-gray-200">
        <h3 class="text-base font-semibold text-blue-600 cursor-pointer hover:underline mb-1">${ipsData.name}</h3>
        <p class="text-sm text-gray-600">${ipsData.address}, ${ipsData.town ?? ""}, ${ipsData.department ?? ""}</p>
      </div>
    `;
    _POPUP_CONTENT.querySelector("h3")?.addEventListener("click", () => {
      router.push(`/ips-details/${encodeURIComponent(ipsData.name)}`);
    });

    new mapboxgl.Marker({ element: _MARKER_ELEMENT })
      .setLngLat([_LNG, _LAT])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(_POPUP_CONTENT))
      .addTo(_MAP);

    _MAP.on("load", () => _MAP.resize());
    return () => _MAP.remove();
  }, [ipsData, router]);

  return (
    <div
      id="map"
      className="w-full h-[400px] sm:h-[600px] rounded-xl shadow-lg overflow-hidden"
    />
  );
};