'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchFormClientProps } from '@/services/search_ips/data_caching.service';
import { SearchableSelect } from './searchable_select';

export default function SearchFormClient({ specialties, eps }: SearchFormClientProps) {
  const router = useRouter();
  const [_IS_SUBMITTING, set_is_submitting] = useState(false);
  const [_ERROR, set_error] = useState<string | null>(null);

  const _HANDLE_SUBMIT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_is_submitting(true);
    set_error(null);

    try {
      const _FORM_DATA = new FormData(e.currentTarget);

      const max_distance = _FORM_DATA.get('max_distance')?.toString() || '5000';
      const specialties = JSON.parse(_FORM_DATA.get('specialties') as string || '[]');
      const eps = JSON.parse(_FORM_DATA.get('eps') as string || '[]');
      const page = _FORM_DATA.get('page')?.toString() || '1';
      const page_size = _FORM_DATA.get('page_size')?.toString() || '10';

      const queryParams = new URLSearchParams({
        max_distance,
        specialties: specialties.join(','),
        eps: eps.join(','),
        page,
        page_size,
      });

      router.push(`/results?${queryParams.toString()}`);
    } catch (err) {
      set_error(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Submission error:', err);
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <form onSubmit={_HANDLE_SUBMIT} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="max_distance" className="block text-sm font-medium text-gray-700">Distancia Máxima:</label>
        <select
          name="max_distance"
          id="max_distance"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
          <option value="15000">15 km</option>
          <option value="20000">20 km</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Especialidades:</label>
        <SearchableSelect
          options={specialties}
          placeholder="Buscar especialidades..."
          name="specialties"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">EPS:</label>
        <SearchableSelect
          options={eps}
          placeholder="Buscar EPS..."
          name="eps"
        />
      </div>

      <div>
        <label htmlFor="page" className="block text-sm font-medium text-gray-700">Página:</label>
        <input
          type="number"
          name="page"
          id="page"
          defaultValue="1"
          min="1"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="page_size" className="block text-sm font-medium text-gray-700">Tamaño de Página:</label>
        <input
          type="number"
          name="page_size"
          id="page_size"
          defaultValue="10"
          min="1"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {_ERROR && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          Error: {_ERROR}
        </div>
      )}

      <button
        type="submit"
        disabled={_IS_SUBMITTING}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {_IS_SUBMITTING ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}