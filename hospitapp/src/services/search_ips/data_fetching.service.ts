import DBAdapter from '@/adapters/db.adapter';
import CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { IpsResponse } from '@/models/ips.interface';


export const getIpsProps = async (params: { name: string }): Promise<IpsResponse | null> => {
    try {
        // Inject the dependencies
        const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
        const SEARCH_IPS_SERVICE = CONTAINER.get<SearchIpsServiceAdapter>(TYPES.SearchIpsServiceAdapter);

        // Fetch the data
        const IPS = await SEARCH_IPS_SERVICE.getIpsByName(params.name);

        // Close the database connection and return the results
        await DB_HANDLER.close();
        return IPS;
    } catch (error) {
        if (error instanceof Error) {
            throw error
        } else {
            throw new Error('Error fetching page props');
        }
    }
}