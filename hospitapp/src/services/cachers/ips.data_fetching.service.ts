import DBAdapter from "@/adapters/db.adapter";
import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";

export const getIpsProps = async (params: {
	name: string;
}): Promise<IpsResponse | null> => {
	const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
	try {
		// Inject the dependencies

		const IPS_SERVICE = CONTAINER.get<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		);

		// Fetch the data
		const IPS = await IPS_SERVICE.getIpsByName(params.name);

		return IPS;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Error fetching page props");
		}
	} finally {
		await DB_HANDLER.close();
	}
};

export const getIpsPropsWithReviews = async (params: {
	name: string;
	reviewsPage: number;
	reviewsPageSize: number;
}): Promise<{
	ips: IpsResponse | null;
	reviewsResult: { reviews: ReviewResponse[]; total: number };
}> => {
	const DB_HANDLER = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
	try {
		// Inject the dependencies

		const IPS_SERVICE = CONTAINER.get<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		);

		// Fetch the data
		const RESULT = await IPS_SERVICE.getIpsByNameWithReviews(
			params.name,
			params.reviewsPage,
			params.reviewsPageSize
		);

		return RESULT;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		} else {
			throw new Error("Error fetching page props");
		}
	} finally {
		await DB_HANDLER.close();
	}
};
