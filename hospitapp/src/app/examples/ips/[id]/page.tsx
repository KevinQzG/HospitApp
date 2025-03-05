// app/examples/ips/[id]/page.tsx
import { get_ips_props } from '@/services/search_ips/data_fetching.service';
import Link from 'next/link';

export default async function IpsDetailPage({ params }: { params: { id: string } }) {
  try {
    const ips = await get_ips_props(params);

    if (!ips) {
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
          <Link href="/examples/ips" className="text-blue-600 hover:underline">
            ← Back to search
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">{ips.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Department:</span> {ips.department}</p>
              <p><span className="font-medium">Town:</span> {ips.town}</p>
              <p><span className="font-medium">Address:</span> {ips.address}</p>
              {ips.phone && <p><span className="font-medium">Phone:</span> {ips.phone}</p>}
              {ips.email && <p><span className="font-medium">Email:</span> {ips.email}</p>}
              {ips.level && <p><span className="font-medium">Level:</span> {ips.level}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Coordinates:</span><br />
                Longitude: {ips.location.coordinates[0]}<br />
                Latitude: {ips.location.coordinates[1]}
              </p>
              <div className="mt-4 space-y-2">
                <a 
                  href={ips.maps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  View on Google Maps →
                </a>
                <a 
                  href={ips.waze} 
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
          {ips.eps && ips.eps.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Accepted EPS</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ips.eps.map(eps => (
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
          {ips.specialties && ips.specialties.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ips.specialties.map(spec => (
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
  } catch {
    return (
      <div className="p-4 text-center text-red-600">
        <h1 className="text-2xl font-bold">Error loading IPS details</h1>
        <Link href="/examples/ips" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to search
        </Link>
      </div>
    );
  }
}