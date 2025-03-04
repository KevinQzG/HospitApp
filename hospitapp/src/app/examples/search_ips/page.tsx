// app/examples/search_ips/page.tsx
'use server';

import { unstable_cache as cache } from 'next/cache'
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import SearchFormClient, { SearchFormClientProps } from './search_form_client';


// Cache configuration
const _CACHE_TAG = 'search-config';
const _CACHE_TTL = 120; // 2 minutes

const get_cached_props = cache(
    async (): Promise<SearchFormClientProps> => {
        try {
            const _DB_HANDLER = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
            const _SEARCH_IPS_SERVICE = _CONTAINER.get<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter);

            const [specialties, eps] = await Promise.all([
                _SEARCH_IPS_SERVICE.get_specialties(),
                _SEARCH_IPS_SERVICE.get_eps(),
            ]);

            await _DB_HANDLER.close();
            return { specialties, eps };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching page props: ${error.message}`);
            } else {
                throw new Error('Error fetching page props');
            }
        }
    },
    [_CACHE_TAG],
    { revalidate: _CACHE_TTL, tags: [_CACHE_TAG] }
)

export default async function SearchIPSPage() {
    let config: SearchFormClientProps;

    try {
        config = await get_cached_props();
    } catch (error) {
        console.error('Page initialization failed:', error);
        return (
            <div>
                <h2>Configuration Error</h2>
                <p>Failed to load required configuration data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div>
            <SearchFormClient specialties={config.specialties} eps={config.eps} />
        </div>
    );
}