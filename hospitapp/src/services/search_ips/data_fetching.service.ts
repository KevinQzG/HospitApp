import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import { IpsResponse } from '@/models/ips.interface';


export const get_ips_props = async (params: { name: string }): Promise<IpsResponse | null> => {
    try {
        // Inject the dependencies
        const _DB_HANDLER = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
        const _SEARCH_IPS_SERVICE = _CONTAINER.get<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter);

        // Fetch the data
        const _IPS = await _SEARCH_IPS_SERVICE.get_ips_by_name(params.name);

        // Close the database connection and return the results
        await _DB_HANDLER.close();
        return _IPS;
    } catch (error) {
        if (error instanceof Error) {
            throw error
        } else {
            throw new Error('Error fetching page props');
        }
    }
}