import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import { _TYPES } from "@/adapters/types";
import { IPSDocument } from "@/models/ips.interface";
import { IPS } from "@/models/ips";
import type DBAdapter from "@/adapters/db.adapter";
import { IpsPipelineBuilder } from "./builders/ips.pipeline.builder";
import { IpsMapper } from "@/utils/mappers/ips_mapper";
import { AggregationResult } from "./ips_mongo_repository.interfaces";

/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class IpsMongoRepository implements IpsRepositoryAdapter {
    /**
     * @constructor
     * @param {DBAdapter} db_handler - The database handler.
     * @returns {void}
     * @description Creates an instance of the IpsMongoRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(_TYPES.DBAdapter) private db_handler: DBAdapter<Db>
    ) {}

    async find_all_by_distance_specialty_eps(
        longitude: number,
        latitude: number,
        max_distance: number,
        specialties: string[],
        eps_names: string[],
        page: number = 1,
        page_size: number = 10
    ): Promise<{ results: IPS[]; total: number }> {
        const _PIPELINE = new IpsPipelineBuilder()
            .add_geo_stage(longitude, latitude, max_distance)
            .matches_specialties(specialties)
            .matches_eps(eps_names)
            .with_pagination(page, page_size)
            .build();

        // Execute the pipeline
        const _DB = await this.db_handler.connect();
        const _AGGREGATION_RESULT = await _DB.collection<IPS>('IPS')
            .aggregate<AggregationResult>(_PIPELINE).next();

        if (!_AGGREGATION_RESULT) {
            return { results: [], total: 0 };
        }

        const _RESULTS = _AGGREGATION_RESULT.data ?? [];
        const _TOTAL = _AGGREGATION_RESULT.metadata?.[0]?.total ?? 0;

        return {
            results: _RESULTS.map(IpsMapper.to_domain),
            total: _TOTAL
        };
    }

    async find_by_id(id: string): Promise<IPS | null> {
        const _PIPELINE = new IpsPipelineBuilder()
            .add_match_id_stage(id)
            .with_eps()
            .with_specialties()
            .build();

        const _DB = await this.db_handler.connect();
        const _AGGREGATION_RESULT = await _DB.collection<IPS>('IPS')
            .aggregate<IPSDocument>(_PIPELINE).next();

        if (!_AGGREGATION_RESULT) {
            return null;
        }

        return IpsMapper.to_domain(_AGGREGATION_RESULT);
    }
}