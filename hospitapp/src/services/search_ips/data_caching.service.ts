import { unstable_cache as cache } from 'next/cache'
import DBAdapter from '@/adapters/db.adapter';
import CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { SpecialtyResponse } from '@/models/specialty.interface';
import { EpsResponse } from '@/models/eps.interface';
import { _ENV } from '@/config/env';

export interface SearchFormClientProps {
    specialties: SpecialtyResponse[];
    eps: EpsResponse[];
}

// Cache configuration
const CACHE_TAG = 'search-config';

export const get_search_ips_cached_props = cache(
    async (): Promise<SearchFormClientProps> => {
        try {
            // Inject the dependencies
            const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
            const SEARCH_IPS_SERVICE = CONTAINER.get<SearchIpsServiceAdapter>(TYPES.SearchIpsServiceAdapter);

            // Fetch the data
            const _RESULTS = {
                specialties: await SEARCH_IPS_SERVICE.get_all_specialties(),
                eps: await SEARCH_IPS_SERVICE.get_all_eps()
            }

            // Close the database connection and return the results
            await DB_HANDLER.close();
            return _RESULTS;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching page props: ${error.message}`);
            } else {
                throw new Error('Error fetching page props');
            }
        }
    },
    [CACHE_TAG],
    { revalidate: _ENV.CACHE_TTL, tags: [CACHE_TAG] }
)