"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Home, ArrowLeft, Hospital, Stethoscope, UserCheck } from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image"; 
import { LookIpsResponse } from "@/app/api/search_ips/ips/route"; 

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface IpsDetailClientProps {
  ipsData: NonNullable<LookIpsResponse["data"]>;
}

export default function IpsDetailClient({ ipsData }: IpsDetailClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"details" | "map">("details");

  const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}`;
  const WAZE_URL = `https://waze.com/ul?ll=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}&navigate=yes`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans flex flex-col">
      <header className="bg-white shadow-lg rounded-b-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-normal break-words max-w-xs sm:max-w-none">{ipsData.name}</h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Inicio
              </Link>
              <Link href="/results" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Resultados
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-end items-center mb-6 sm:mb-8">
          <div className="flex space-x-2 sm:space-x-4">
            <button onClick={() => setViewMode("details")} className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${viewMode === "details" ? "bg-blue-700 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Detalles
            </button>
            <button onClick={() => setViewMode("map")} className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${viewMode === "map" ? "bg-blue-700 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              Mapa
            </button>
          </div>
        </div>

        {viewMode === "details" ? <DetailsView ipsData={ipsData} /> : <MapView ipsData={ipsData} router={router} />}
      </main>
    </div>
  );
}

const DetailsView = ({ ipsData }: { ipsData: NonNullable<LookIpsResponse["data"]> }) => {
  const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}`;
  const WAZE_URL = `https://waze.com/ul?ll=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}&navigate=yes`;

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
      <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <Hospital className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 flex-shrink-0" />
          Información General
        </h2>
        <ul className="space-y-4 sm:space-y-5 text-gray-700 text-sm sm:text-base">
          <li className="flex items-center">
            <MapPin size={18} className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
            <span>{ipsData.department}, {ipsData.town}</span>
          </li>
          <li className="flex items-center">
            <MapPin size={18} className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
            <span>{ipsData.address}</span>
          </li>
          {ipsData.phone && (
            <li className="flex items-center">
              <Phone size={18} className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
              <span>{ipsData.phone}</span>
            </li>
          )}
          {ipsData.email && (
            <li className="flex items-center">
              <Mail size={18} className="mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
              <span>{ipsData.email}</span>
            </li>
          )}
          {ipsData.level && (
            <li className="flex items-center">
              <span className="font-medium text-gray-900 mr-2">Nivel:</span>
              <span>{ipsData.level}</span>
            </li>
          )}
        </ul>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Cómo llegar</h2>
        <nav aria-label="Opciones de navegación">
          <ul className="space-y-4">
            <li className="flex flex-col items-start">
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4" aria-label="Abrir ubicación en Google Maps">
                <Image src="/stock/GMaps.png" alt="Google Maps Icon" width={0} height={0} sizes="100vw" className="w-3/4 sm:w-full h-10 sm:h-12 object-contain" />
              </a>
            </li>
            <li className="flex flex-col items-start">
              <a href={WAZE_URL} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4" aria-label="Abrir ubicación en Waze">
                <Image src="/stock/Waze.png" alt="Waze Icon" width={0} height={0} sizes="100vw" className="w-3/4 sm:w-full h-10 sm:h-12 object-contain" />
              </a>
            </li>
          </ul>
        </nav>
      </section>

      {ipsData.eps && ipsData.eps.length > 0 && (
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:col-span-2 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 flex-shrink-0" />
            EPS Aceptadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ipsData.eps.map((eps) => (
              <div key={eps._id} className="flex items-center bg-blue-50 border border-blue-100 rounded-lg p-3 hover:bg-blue-100 hover:shadow-sm transition-all duration-300">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{eps.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {ipsData.specialties && ipsData.specialties.length > 0 && (
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:col-span-2 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 flex-shrink-0" />
            Especialidades
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ipsData.specialties.map((spec) => (
              <div key={spec._id} className="flex items-center bg-blue-50 border border-blue-100 rounded-lg p-3 hover:bg-blue-100 hover:shadow-sm transition-all duration-300">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{spec.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const MapView = ({ ipsData, router }: { ipsData: NonNullable<LookIpsResponse["data"]>; router: ReturnType<typeof useRouter>; }) => {
  useEffect(() => {
    const [lng, lat] = ipsData.location.coordinates;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), "top-right");

    const markerElement = document.createElement("div");
    markerElement.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/></svg>`;

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `<div class="bg-white p-4 rounded-xl shadow-xl max-w-sm border border-gray-200"><h3 class="text-lg font-semibold text-blue-600 cursor-pointer hover:underline mb-2">${ipsData.name}</h3><p className="text-sm text-gray-600">${ipsData.address}, ${ipsData.town ?? ""}, ${ipsData.department ?? ""}</p></div>`;
    popupContent.querySelector("h3")?.addEventListener("click", () => { router.push(`/ips-details/${encodeURIComponent(ipsData.name)}`); });

    new mapboxgl.Marker({ element: markerElement }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)).addTo(map);

    map.on("load", () => map.resize());
    return () => map.remove();
  }, [ipsData, router]);

  return <div id="map" className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl shadow-xl overflow-hidden border border-gray-200" />;
};