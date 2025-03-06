// app/examples/search_ips/page.tsx
'use server';

import { SearchFormClientProps, get_search_ips_cached_props } from '@/services/search_ips/data_caching.service';
import SearchFormClient from './search_form_client';

export default async function SearchIPSPage() {
    let config: SearchFormClientProps;

    try {
        config = await get_search_ips_cached_props();
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