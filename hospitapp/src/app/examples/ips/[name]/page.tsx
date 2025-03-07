import { LookIpsResponse } from '@/app/api/search_ips/ips/route';
import Link from 'next/link';
import { _ENV } from '@/config/env';

// Define props with params as a Promise
type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
  const resolvedParams = await params; // Resolve the Promise
  let { name } = resolvedParams;

  name = decodeURIComponent(name);
  try {
    const _RESPONSE = await fetch(`${_ENV.NEXT_PUBLIC_API_URL}/search_ips/ips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    });

    if (!_RESPONSE.ok) {
      const _ERROR_DATA: LookIpsResponse = await _RESPONSE.json();
      return (
        <div className="p-4 text-center text-red-600">
          <h1 className="text-2xl font-bold">Error loading IPS details</h1>
          <p className="text-sm">{_ERROR_DATA.error}</p>
          <Link href="/examples/ips" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to search
          </Link>
        </div>
      );
    }

    const _DATA: LookIpsResponse = await _RESPONSE.json();
    const _IPS = _DATA.data;

    if (!_IPS) {
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold">IPS not found</h1>
          <Link href="/examples/ips" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to search
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/examples/search_ips" className="text-blue-600 hover:underline">
            ← Back to search
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">{_IPS.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl text-black font-semibold mb-4">General Information</h2>
            <div className="space-y-2">
              <p className="text-black">
                <span className="text-black font-medium">Department:</span> {_IPS.department}
              </p>
              <p className="text-black">
                <span className="text-black font-medium">Town:</span> {_IPS.town}
              </p>
              <p className="text-black">
                <span className="text-black font-medium">Address:</span> {_IPS.address}
              </p>
              {_IPS.phone && (
                <p className="text-black">
                  <span className="font-medium">Phone:</span> {_IPS.phone}
                </p>
              )}
              {_IPS.email && (
                <p className="text-black">
                  <span className="font-medium">Email:</span> {_IPS.email}
                </p>
              )}
              {_IPS.level && (
                <p className="text-black">
                  <span className="font-medium">Level:</span> {_IPS.level}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-black">Location</h2>
            <div className="space-y-2">
              <p className="text-black">
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
                  className="text-blue-600 hover:underline block"
                >
                  View on Google Maps →
                </a>
                <a
                  href={_IPS.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  View on Waze →
                </a>
              </div>
            </div>
          </div>

          {/* EPS */}
          {_IPS.eps && _IPS.eps.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-black">Accepted EPS</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {_IPS.eps.map((eps) => (
                  <span
                    key={eps._id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {eps.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specialties */}
          {_IPS.specialties && _IPS.specialties.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-black">Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {_IPS.specialties.map((spec) => (
                  <span
                    key={spec._id}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <h1 className="text-2xl font-bold">Error loading IPS</h1>
        <p className="text-sm">{(error as Error).message}</p>
        <Link href="/examples/ips" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to search
        </Link>
      </div>
    );
  }
}