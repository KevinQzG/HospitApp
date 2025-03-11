// app/ips-details/[name]/page.tsx
import Link from "next/link";
import { _ENV } from "@/config/env";
import { MapPin, Mail, Phone, Landmark, Home, ArrowLeft } from "lucide-react";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";

type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
  const resolvedParams = await params;
  const { name } = resolvedParams;
  const decodedName = decodeURIComponent(name);

  try {
    const _RESPONSE = await fetch(`${_ENV.NEXT_PUBLIC_API_URL}/search_ips/ips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: decodedName }),
    });

    if (!_RESPONSE.ok) {
      const _ERROR_DATA: LookIpsResponse = await _RESPONSE.json();
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Something Went Wrong
            </h1>
            <p className="mt-2 text-sm text-gray-500">{_ERROR_DATA.error}</p>
            <Link
              href="/results"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Regresar a resultados de búsqueda
            </Link>
          </div>
        </div>
      );
    }

    const _DATA: LookIpsResponse = await _RESPONSE.json();
    const _IPS = _DATA.data;

    if (!_IPS) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              IPS Not Found
            </h1>
            <Link
              href="/results"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Regresar a resultados de búsqueda
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  <Home className="w-5 h-5 mr-2" />
                  <span className="text-base font-medium">Volver al Inicio</span>
                </Link>
                <Link
                  href="/results"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="text-base font-medium">
                    Regresar a resultados
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 transition-all duration-300">
            <div className="bg-gray-100 p-6 rounded-2xl">
              <Landmark size={64} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                {_IPS.name}
              </h1>
              <div className="flex items-center mt-3 space-x-2">
                <span className="text-lg text-yellow-700 font-medium">
                  ⭐ 4.7
                </span>
                <span className="text-sm text-gray-500">(578 Reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-3xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información General
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <MapPin size={20} className="mr-3 text-blue-600" />
                  <span>
                    {_IPS.department}, {_IPS.town}
                  </span>
                </li>
                <li className="flex items-center">
                  <MapPin size={20} className="mr-3 text-blue-600" />
                  <span>{_IPS.address}</span>
                </li>
                {_IPS.phone && (
                  <li className="flex items-center">
                    <Phone size={20} className="mr-3 text-blue-600" />
                    <span>{_IPS.phone}</span>
                  </li>
                )}
                {_IPS.email && (
                  <li className="flex items-center">
                    <Mail size={20} className="mr-3 text-blue-600" />
                    <span>{_IPS.email}</span>
                  </li>
                )}
                {_IPS.level && (
                  <li className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">
                      Nivel:
                    </span>
                    <span>{_IPS.level}</span>
                  </li>
                )}
              </ul>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ubicación
              </h2>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">
                  Coordenadas:
                </span>
                <br />
                <span className="text-gray-600">
                  Longitud: {_IPS.location.coordinates[0]}
                </span>
                <br />
                <span className="text-gray-600">
                  Latitud: {_IPS.location.coordinates[1]}
                </span>
              </p>
              <div className="mt-4 space-y-2">
                <a
                  href={_IPS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
                >
                  Ver en Google Maps →
                </a>
                <a
                  href={_IPS.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
                >
                  Ver en Waze →
                </a>
              </div>
            </section>

            {_IPS.eps && _IPS.eps.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2 transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  EPS Aceptadas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {_IPS.eps.map((eps) => (
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

            {_IPS.specialties && _IPS.specialties.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2 transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Especialidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {_IPS.specialties.map((spec) => (
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
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Error Loading IPS
          </h1>
          <p className="mt-2 text-sm text-gray-500">{(error as Error).message}</p>
          <Link
            href="/results"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            Regresar a resultados de búsqueda
          </Link>
        </div>
      </div>
    );
  }
}