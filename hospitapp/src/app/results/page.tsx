'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Hospital } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface Specialty {
  _id: string;
  name: string;
  schedule_monday?: string;
  schedule_tuesday?: string;
  schedule_wednesday?: string;
  schedule_thursday?: string;
  schedule_friday?: string;
  schedule_saturday?: string;
  schedule_sunday?: string;
}

interface Eps {
  _id: string;
  name: string;
  '01_8000_phone': string;
  fax: string;
  emails: string;
}

interface Location {
  type: string;
  coordinates: [number, number];
}

interface IpsResponse {
  _id: string;
  name: string;
  address: string;
  town?: string;
  department?: string;
  location: Location;
  phone?: string | number;
  email?: string;
  level?: number;
  distance?: number;
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
    total_pages: number;
    page: number;
    page_size: number;
  };
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listView, setListView] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const max_distance = searchParams.get('max_distance') || '5000';
        const specialties = searchParams.get('specialties')?.split(',') || [];
        const eps = searchParams.get('eps')?.split(',') || [];
        const page = searchParams.get('page') || '1';
        const page_size = searchParams.get('page_size') || '10';

        const coordinates = [-75.5849, 6.1816]; 

        const response = await fetch('/api/search_ips/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coordinates,
            max_distance: parseInt(max_distance),
            specialties,
            eps,
            page: parseInt(page),
            page_size: parseInt(page_size),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
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

  if (error || !results?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-center text-red-500 text-lg">
          Error: {error || results?.error || 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Resultados de Búsqueda de IPS (Página {results.pagination?.page} de {results.pagination?.total_pages})
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => setListView(true)}
            className={`px-4 py-2 rounded ${listView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Lista
          </button>
          <button
            onClick={() => setListView(false)}
            className={`px-4 py-2 rounded ${!listView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Mapa
          </button>
        </div>
      </div>

      {listView ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.data?.map((item) => (
            <Link
              key={item._id}
              href={`/ips-details/${encodeURIComponent(item.name)}`}
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative flex items-center justify-center h-20 bg-blue-50 mb-4">
                <Hospital className="w-12 h-12 text-blue-500" />
                <span className="absolute top-2 left-2 bg-blue- text-blue-800 text-xs font-semibold px-2 py-1">
                </span>
              </div>
              <div className="p-2">
                <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {item.address} {item.town && `, ${item.town}`} {item.department && `, ${item.department}`}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Distancia: {item.distance !== undefined ? `${Math.round(item.distance)} metros` : 'No disponible'}
                </p>
                <button className="mt-4 w-full bg-blue-500 text-white text-sm py-2 rounded hover:bg-blue-600">
                  Contactar
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-[600px] w-full">
          <MapComponent results={results.data || []} />
        </div>
      )}
    </div>
  );
}

const MapComponent = ({ results }: { results: IpsResponse[] }) => {
  const router = useRouter(); 

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-75.5849, 6.1816],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl());

    results.forEach((item) => {
      if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
        const [longitude, latitude] = item.location.coordinates;
        const lat = parseFloat(String(latitude));
        const lng = parseFloat(String(longitude));

        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h3 class="text-lg font-semibold">${item.name}</h3><p class="text-sm">${item.address}, ${item.town || ''}, ${item.department || ''}</p>`
              )
            )
            .addTo(map);

          marker.getElement().addEventListener('click', () => {
            router.push(`/ips-details/${encodeURIComponent(item.name)}`);
          });
        } else {
          console.warn(`Coordenadas inválidas para ${item.name}: lat=${lat}, lng=${lng}`);
        }
      } else {
        console.warn(`Location o coordinates inválidos para ${item.name}`);
      }
    });

    return () => map.remove();
  }, [results, router]);

  return <div id="map" className="w-full h-full rounded-lg shadow-md" />;
};

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResultsPageContent />
    </Suspense>
  );
}