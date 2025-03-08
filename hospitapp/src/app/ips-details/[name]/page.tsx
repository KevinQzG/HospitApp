import { LookIpsResponse } from '@/app/api/search_ips/ips/route';
import Link from 'next/link';
import { _ENV } from '@/config/env';
import { MapPin, Mail, Phone, Landmark } from 'lucide-react';

type IpsDetailPageProps = {
  params: Promise<{ name: string }>; // Explicitly type params as a Promise
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
  const resolvedParams = await params; // Await the params Promise
  const { name } = resolvedParams; // Now safely destructure
  const decodedName = decodeURIComponent(name);

  try {
    const _RESPONSE = await fetch(`${_ENV.NEXT_PUBLIC_API_URL}/search_ips/ips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: decodedName }),
    });

    if (!_RESPONSE.ok) {
      const _ERROR_DATA: LookIpsResponse = await _RESPONSE.json();
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">Something Went Wrong</h1>
            <p className="mt-2 text-sm text-gray-500">{_ERROR_DATA.error}</p>
            <Link href="/results" className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition">
              Back to Search
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
            <h1 className="text-3xl font-semibold text-gray-900">IPS Not Found</h1>
            <Link href="/results" className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition">
              Back to Search
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <Link href="/results" className="text-blue-500 hover:text-blue-700 text-sm font-medium transition">
              ← Back to Search
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="bg-gray-100 p-6 rounded-2xl">
              <Landmark size={64} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">{_IPS.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-lg text-yellow-500 font-medium">⭐ 4.7</span>
                <span className="text-sm text-gray-500">(578 Reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">General Information</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <MapPin size={20} className="mr-3 text-blue-500" />
                  {_IPS.department}, {_IPS.town}
                </li>
                <li className="flex items-center">
                  <MapPin size={20} className="mr-3 text-blue-500" />
                  {_IPS.address}
                </li>
                {_IPS.phone && (
                  <li className="flex items-center">
                    <Phone size={20} className="mr-3 text-blue-500" />
                    {_IPS.phone}
                  </li>
                )}
                {_IPS.email && (
                  <li className="flex items-center">
                    <Mail size={20} className="mr-3 text-blue-500" />
                    {_IPS.email}
                  </li>
                )}
                {_IPS.level && (
                  <li>
                    <span className="font-medium text-gray-900">Level: </span>
                    {_IPS.level}
                  </li>
                )}
              </ul>
            </section>

            <section className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-700">
                <span className="font-medium">Coordinates:</span>
                <br />
                Longitude: {_IPS.location.coordinates[0]}
                <br />
                Latitude: {_IPS.location.coordinates[1]}
              </p>
              <div className="mt-4 space-y-2">
                <a
                  href={_IPS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-700 transition"
                >
                  View on Google Maps →
                </a>
                <a
                  href={_IPS.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-700 transition"
                >
                  View on Waze →
                </a>
              </div>
            </section>

            {_IPS.eps && _IPS.eps.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Accepted EPS</h2>
                <div className="flex flex-wrap gap-2">
                  {_IPS.eps.map((eps) => (
                    <span
                      key={eps._id}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                    >
                      {eps.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {_IPS.specialties && _IPS.specialties.length > 0 && (
              <section className="bg-white rounded-3xl shadow-sm p-6 md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {_IPS.specialties.map((spec) => (
                    <span
                      key={spec._id}
                      className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium"
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
          <h1 className="text-3xl font-semibold text-gray-900">Error Loading IPS</h1>
          <p className="mt-2 text-sm text-gray-500">{(error as Error).message}</p>
          <Link href="/results" className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
}