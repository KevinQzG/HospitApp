'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { SearchResponse } from '@/app/api/search_ips/filter/route';
import { SearchFormClientProps } from '@/services/search_ips/data_caching.service';

interface FormData {
  coordinates: [number, number];
  max_distance: number;
  specialties: string[];
  eps: string[];
  page: number;
  page_size: number;
}

export default function SearchFormClient({ specialties, eps }: SearchFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResults(null);


    try {
      // Safely access form elements
      const form = e.currentTarget;
      const formElements = form.elements as unknown as {
        max_distance: HTMLSelectElement;
        specialties: HTMLSelectElement;
        eps: HTMLSelectElement;
        page: HTMLInputElement;
        page_size: HTMLInputElement;
      };

      // Get geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          err => reject(new Error(`Geolocation error: ${err.message}`)),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      // Build form data
      const requestData: FormData = {
        coordinates: [position.coords.longitude, position.coords.latitude],
        max_distance: parseInt(formElements.max_distance.value),
        specialties: Array.from(formElements.specialties.selectedOptions)
          .map(option => option.value),
        eps: Array.from(formElements.eps.selectedOptions)
          .map(option => option.value),
        page: parseInt(formElements.page.value) || 1,
        page_size: parseInt(formElements.page_size.value) || 10
      };

      // API call
      const response = await fetch('/api/search_ips/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const result = await response.json();
      setResults(result);
      console.log('Search results:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="max_distance">Maximum Distance:</label>
        <select name="max_distance" id="max_distance" required>
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
          <option value="15000">15 km</option>
          <option value="20000">20 km</option>
        </select>
      </div>

      <div>
        <label htmlFor="specialties">Specialties:</label>
        <select name="specialties" id="specialties" multiple>
          {specialties.map((spec) => (
            <option key={spec._id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="eps">EPS:</label>
        <select name="eps" id="eps" multiple>
          {eps.map((eps_item) => (
            <option key={eps_item._id} value={eps_item.name}>
              {eps_item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="page">Page:</label>
        <input type="number" name="page" id="page" defaultValue="1" min="1" required />
      </div>

      <div>
        <label htmlFor="page_size">Page Size:</label>
        <input type="number" name="page_size" id="page_size" defaultValue="10" min="1" required />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="p-3 bg-gray-50 rounded-md space-y-4">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>

          {/* Pagination Info */}
          {results.pagination && (
            <div className="mb-4 text-sm text-gray-600">
              Showing page {results.pagination.page} of {results.pagination.total_pages} -
              {results.pagination.total} total results
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2">
            {results.data?.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/examples/ips/${item._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {item.name}
                </Link>

                <div className="mt-2 text-sm text-gray-600">
                  <p>{item.address}, {item.town}, {item.department}</p>
                  {item.distance && (
                    <p>{Math.round(item.distance)} meters away</p>
                  )}
                </div>

                {/* EPS List */}
                {item.eps && item.eps.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Accepted EPS:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.eps.map((eps) => (
                        <span
                          key={eps._id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {eps.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties List */}
                {item.specialties && item.specialties.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Specialties:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.specialties.map((spec) => (
                        <span
                          key={spec._id}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {spec.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Summary */}
          {results.pagination && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {results.pagination.page_size} items per page
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}