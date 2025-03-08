'use client'; // Asegúrate de que este componente sea un Client Component
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {Loader2 } from 'lucide-react'; 

interface SearchResponse {
  data: Array<{
    _id: string;
    name: string;
    address: string;
    town: string;
    department: string;
    distance?: number;
    eps: Array<{ _id: string; name: string }>;
    specialties: Array<{ _id: string; name: string }>;
  }>;
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const max_distance = searchParams.get('max_distance') || '5000';
        const specialties = searchParams.get('specialties')?.split(',') || [];
        const eps = searchParams.get('eps')?.split(',') || [];
        const page = searchParams.get('page') || '1';
        const page_size = searchParams.get('page_size') || '10';

        const response = await fetch('/api/search_ips/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
          {/* Spinner más grande y del color azul de la app */}
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
          {/* Texto de carga con tipografía clara */}
          <p className="text-xl font-medium text-gray-700 animate-fade-in">
            Buscando resultados...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-center text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Resultados de la Búsqueda</h1>
      <div className="space-y-4">
        {results?.data.map((item) => (
          <Link
            key={item._id}
            href={`/ips-details/${encodeURIComponent(item.name)}`}
            className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300">
              {item.name}
            </h2>
            <p className="text-gray-600 mt-2">
              {item.address}, {item.town}, {item.department}
            </p>
            {item.distance && (
              <p className="text-sm text-gray-500 mt-1">{Math.round(item.distance)} metros de distancia</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResultsPageContent />
    </Suspense>
  );
}