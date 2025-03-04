// app/examples/search_ips/page.tsx
import { unstable_cache } from 'next/cache'
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import { SpecialtyDocument } from '@/models/specialty.interface';
import { EPSDocument } from '@/models/eps.interface';

interface PageProps {
    specialties: SpecialtyDocument[];
    eps: EPSDocument[];
}

const get_page_props: () => Promise<PageProps> = unstable_cache(
    async () => {
        const _DB_HANDLER = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
        const _SEARCH_IPS_SERVICE = _CONTAINER.get<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter);
    
        const _RESULT: PageProps = {
            specialties: await _SEARCH_IPS_SERVICE.get_specialties(),
            eps: await _SEARCH_IPS_SERVICE.get_eps()
        };
        _DB_HANDLER.close();
        return _RESULT;
    },
    ['specialties_eps_props'],
    { revalidate: 180, tags: ['specialties_eps_props'] }
)

export default async function search_ips_page() {
    const _RESULT = await get_page_props();

    return (
        <div>
            <form id="searchForm" method="POST" action="/api/search_ips/filter">
                {/* <input type="hidden" name="coordinates[0]" value="-75.63813564857911" />
                <input type="hidden" name="coordinates[1]" value="6.133477697463028" /> */}

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
                        {_RESULT.specialties.map((spec) => (
                            <option key={spec._id.toString()} value={spec.name}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="eps">EPS:</label>
                    <select name="eps" id="eps" multiple>
                        {_RESULT.eps.map((eps) => (
                            <option key={eps._id.toString()} value={eps.name}>
                                {eps.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="page">Page:</label>
                    <input
                        type="number"
                        name="page"
                        id="page"
                        defaultValue="1"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="page_size">Page Size:</label>
                    <input
                        type="number"
                        name="page_size"
                        id="page_size"
                        defaultValue="10"
                        min="1"
                        required
                    />
                </div>

                <button type="submit">Search</button>
            </form>

            <script dangerouslySetInnerHTML={{
                __html: `
                    document.getElementById('searchForm').addEventListener('submit', async (e) => {
                        e.preventDefault();

                        let longitude;
                        let latitude;

                        // Wrap geolocation in a promise
                        const getPosition = () => new Promise((resolve, reject) => {
                            if (!navigator.geolocation) {
                                reject('Geolocation is not supported by this browser.');
                            }

                            navigator.geolocation.getCurrentPosition(
                                position => resolve(position),
                                error => reject(error),
                                { enableHighAccuracy: true, timeout: 10000 }
                            );
                        });

                        // Wait for position before proceeding
                        const position = await getPosition();
                        longitude = position.coords.longitude;
                        latitude = position.coords.latitude;
                        
                        const formData = {
                            coordinates: [longitude, latitude],
                            max_distance: parseInt(document.getElementById('max_distance').value),
                            specialties: Array.from(document.getElementById('specialties').selectedOptions)
                                            .map(option => option.value),
                            eps: Array.from(document.getElementById('eps').selectedOptions)
                                    .map(option => option.value),
                            page: parseInt(document.getElementById('page').value),
                            page_size: parseInt(document.getElementById('page_size').value)
                        };
                        console.log('Form Data JSON:', formData);

                        try {
                            const response = await fetch('/api/search_ips/filter', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(formData)
                            });

                            const data = await response.json();
                            console.log('Search results:', data);
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });
                `
            }} />
        </div>
    );
}

export const revalidate = 60;