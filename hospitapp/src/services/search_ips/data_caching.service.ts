import { unstable_cache as cache } from "next/cache";
import CONTAINER from "@/adapters/container";
import SpecialtyServiceAdapter from "@/adapters/services/specialty.service.adapter";
import EpsServiceAdapter from "@/adapters/services/eps.service.adapter";
import { TYPES } from "@/adapters/types";
import { SpecialtyResponse } from "@/models/specialty.interface";
import { EpsResponse } from "@/models/eps.interface";
import { ENV } from "@/config/env";

export interface SearchFormClientProps {
	specialties: SpecialtyResponse[];
	eps: EpsResponse[];
}

// Cache configuration
const CACHE_TAG = "search-config";

export const getSearchIpsCachedProps = cache(
	async (): Promise<SearchFormClientProps> => {
		try {
			// Inject the dependencies
			const EPS_SERVICE = CONTAINER.get<EpsServiceAdapter>(
				TYPES.EpsServiceAdapter
			);
			const SPECIALTY_SERVICE = CONTAINER.get<SpecialtyServiceAdapter>(
				TYPES.SpecialtyServiceAdapter
			);

			// Fetch the data
			const RESULTS = {
				specialties: await SPECIALTY_SERVICE.getAllSpecialties(),
				eps: await EPS_SERVICE.getAllEps(),
			};

			return RESULTS;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Error fetching page props: ${error.message}`);
			} else {
				throw new Error("Error fetching page props");
			}
		}
	},
	[CACHE_TAG],
	{ revalidate: ENV.CACHE_TTL, tags: [CACHE_TAG] }
);