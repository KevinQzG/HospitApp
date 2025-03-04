'use client';

import { FormEvent, useState } from 'react';
import { SpecialtyResponse } from '@/models/specialty.interface';
import { EPSResponse } from '@/models/eps.interface';
import { SearchResponse } from '@/app/api/search_ips/filter/route';

export interface SearchFormClientProps {
  specialties: SpecialtyResponse[];
  eps: EPSResponse[];
}

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
        <div className="p-3 bg-gray-50 text-black rounded-md">
          <h3 className="text-lg text-black font-semibold mb-2">Results</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
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