import { unstable_cache as cache } from 'next/cache'
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import { SpecialtyResponse } from '@/models/specialty.interface';
import { EpsResponse } from '@/models/eps.interface';
import { _ENV } from '@/config/env';

export interface SearchFormClientProps {
    specialties: SpecialtyResponse[];
    eps: EpsResponse[];
}

// Cache configuration
const _CACHE_TAG = 'search-config';

export const get_search_ips_cached_props = cache(
    async (): Promise<SearchFormClientProps> => {
        try {
            // Inject the dependencies
            const _DB_HANDLER = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
            const _SEARCH_IPS_SERVICE = _CONTAINER.get<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter);

            // Fetch the data
            const _RESULTS = {
                specialties: await _SEARCH_IPS_SERVICE.get_all_specialties(),
                eps: await _SEARCH_IPS_SERVICE.get_all_eps()
            }

            // Close the database connection and return the results
            await _DB_HANDLER.close();
            return _RESULTS;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching page props: ${error.message}`);
            } else {
                throw new Error('Error fetching page props');
            }
        }
    },
    [_CACHE_TAG],
    { revalidate: _ENV.CACHE_TTL, tags: [_CACHE_TAG] }
)