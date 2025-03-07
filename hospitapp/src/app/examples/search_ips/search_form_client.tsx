'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { SearchResponse } from '@/app/api/search_ips/filter/route';
import { SearchFormClientProps } from '@/services/search_ips/data_caching.service';
import { SearchableSelect } from './searchable_select';

interface FormData {
  coordinates: [number, number] | null;
  max_distance: number;
  specialties: string[];
  eps: string[];
  page: number;
  page_size: number;
}

export default function SearchFormClient({ specialties, eps }: SearchFormClientProps) {
  const [_IS_SUBMITTING, set_is_submitting] = useState(false);
  const [_ERROR, set_error] = useState<string | null>(null);
  const [_RESULTS, set_results] = useState<SearchResponse | null>(null);

  const _HANDLE_SUBMIT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_is_submitting(true);
    set_error(null);
    set_results(null);


    try {
      // Safely access form elements
      const _FORM_DATA = new FormData(e.currentTarget);

      // Default to empty coordinates if location is not available
      let _COORDINATES: [number, number] | null = null;

      try {
        const _POSITION = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });
        _COORDINATES = [_POSITION.coords.longitude, _POSITION.coords.latitude];
      } catch (error) {
        console.warn('Geolocation permission denied or error occurred.');
      }

      const _SPECIALTIES = JSON.parse(_FORM_DATA.get('specialties') as string || '[]');
      const _EPS = JSON.parse(_FORM_DATA.get('eps') as string || '[]');

      // Build form data
      const _REQUEST_DATA: FormData = {
        coordinates: _COORDINATES,
        max_distance: parseInt(_FORM_DATA.get('max_distance')?.toString() || '5000'),
        specialties: _SPECIALTIES,
        eps: _EPS,
        page: parseInt(_FORM_DATA.get('page')?.toString() || '1'),
        page_size: parseInt(_FORM_DATA.get('page_size')?.toString() || '10')
      };
      console.log('Request data:', _REQUEST_DATA);

      // API call
      const _RESPONSE = await fetch('/api/search_ips/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_REQUEST_DATA)
      });

      if (!_RESPONSE.ok) {
        const _ERROR_DATA = await _RESPONSE.json();
        throw new Error(_ERROR_DATA.error || 'API request failed');
      }

      const _RESULT = await _RESPONSE.json();
      set_results(_RESULT);
      console.log('Search results:', _RESULT);
    } catch (err) {
      set_error(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Submission error:', err);
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <form onSubmit={_HANDLE_SUBMIT} className="space-y-4">
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
        <label className="block mb-1">Specialties:</label>
        <SearchableSelect
          options={specialties}
          placeholder="Search specialties..."
          name="specialties"
        />
      </div>

      <div>
        <label className="block mb-1">EPS:</label>
        <SearchableSelect
          options={eps}
          placeholder="Search EPS..."
          name="eps"
        />
      </div>

      <div>
        <label htmlFor="page">Page:</label>
        <input type="number" name="page" id="page" defaultValue="1" min="1" required />
      </div>

      <div>
        <label htmlFor="page_size">Page Size:</label>
        <input type="number" name="page_size" id="page_size" defaultValue="10" min="1" required />
      </div>

      {_ERROR && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          Error: {_ERROR}
        </div>
      )}

      {_RESULTS && (
        <div className="p-3 bg-gray-50 rounded-md space-y-4">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>

          {/* Pagination Info */}
          {_RESULTS.pagination && (
            <div className="mb-4 text-sm text-gray-600">
              Showing page {_RESULTS.pagination.page} of {_RESULTS.pagination.total_pages} -
              {_RESULTS.pagination.total} total results
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2">
            {_RESULTS.data?.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/examples/ips/${encodeURIComponent(item.name)}`}
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
          {_RESULTS.pagination && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {_RESULTS.pagination.page_size} items per page
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={_IS_SUBMITTING}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {_IS_SUBMITTING ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}