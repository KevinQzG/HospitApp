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

      let coordinates: [number, number] = [-75.5849, 6.1816]; // Medellín Default Center
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
          });
        });
        coordinates = [position.coords.longitude, position.coords.latitude];
      } catch (error) {
        console.warn('No se pudo obtener la ubicación del usuario:', error);
      }

      const max_distance = '20000'; // Default value of 20 km
      const specialties = JSON.parse(_FORM_DATA.get('specialties') as string || '[]');
      const eps = JSON.parse(_FORM_DATA.get('eps') as string || '[]');
      const page = '1';
      const page_size = '21';

      const queryParams = new URLSearchParams({
        coordinates: coordinates.join(','), 
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
    <form 
      onSubmit={_HANDLE_SUBMIT} 
      className={`bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto space-y-6 ${
        _IS_SUBMITTING ? 'cursor-wait' : ''
      }`}
    >
      <h2 className="text-2xl font-semibold text-gray-900 text-center">Buscar Atención Médica</h2>

      <div>
        <label className="block text-lg font-medium text-gray-800 mb-1">Especialidades</label>
        <SearchableSelect
          options={specialties}
          placeholder="Selecciona especialidades..."
          name="specialties"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-800 mb-1">EPS</label>
        <SearchableSelect
          options={eps}
          placeholder="Selecciona EPS..."
          name="eps"
        />
      </div>

      {_ERROR && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-center">
          <strong>Error:</strong> {_ERROR}
        </div>
      )}

      <button
        type="submit"
        disabled={_IS_SUBMITTING}
        className={`w-full bg-blue-600 text-white text-lg font-semibold p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 ${
          _IS_SUBMITTING ? 'cursor-wait' : 'cursor-pointer'
        }`}
      >
        {_IS_SUBMITTING ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}