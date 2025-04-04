import DBAdapter from '@/adapters/db.adapter';
import CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { IpsDocument, IpsResponse } from '@/models/ips.interface';
import CreateIpsServiceAdapter from '@/adapters/create_ips.service.adapter';


export const getIpsProps = async (params: { name: string }): Promise<IpsResponse | null> => {
    const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
    try {
        // Inject the dependencies
        
        const SEARCH_IPS_SERVICE = CONTAINER.get<SearchIpsServiceAdapter>(TYPES.SearchIpsServiceAdapter);

        // Fetch the data
        const IPS = await SEARCH_IPS_SERVICE.getIpsByName(params.name);

        return IPS;
    } catch (error) {
        if (error instanceof Error) {
            throw error
        } else {
            throw new Error('Error fetching page props');
        }
    } finally {
        await DB_HANDLER.close();
    }
}

/**
 * Service function to create a new IPS entry in the database
 * @param {object} params - IPS details
 * @param {string} params.name - The name of the IPS
 * @param {string} params.address - The address of the IPS
 * @param {string} params.phone - The contact phone number
 * @returns {Promise<IpsResponse>} - Created IPS response
 */
import { Ips } from '@/models/ips';
import { Eps } from '@/models/eps';
import { Specialty } from '@/models/specialty';
import { ObjectId } from 'mongodb';

export const createIps = async (
  params: { name: string; address: string; phone: string }
): Promise<Ips> => {
  const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
  try {
    const CREATE_IPS_SERVICE_ADAPTER = CONTAINER.get<CreateIpsServiceAdapter>(TYPES.CreateIpsServiceAdapter);

    // Asegura que coincida con el tipo Ips
    const newIps = new Ips(
        params.name,
        params.address,
        params.phone,
        new ObjectId(),
        '',
        '',
        { type: '', coordinates: [0, 0] }
    );

    const result = await CREATE_IPS_SERVICE_ADAPTER.create(newIps);

    if (!result) {
      throw new Error('Failed to create IPS.');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error creating IPS entry');
    }
  } finally {
    await DB_HANDLER.close();
  }
};
