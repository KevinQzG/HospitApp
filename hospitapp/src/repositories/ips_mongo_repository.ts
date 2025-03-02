import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import IpsRepositoryInterface from "@/adapters/ips_repository_interface";
import { _TYPES } from "@/adapters/types";
import { IPS } from "@/models/ips";
import type DBInterface from "@/adapters/db_interface";
import { PipelineStage, AggregationResult } from "./ips_mongo_repository.interfaces";

/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class IpsMongoRepository implements IpsRepositoryInterface {
    private db_handler: DBInterface<Db>;

    /**
     * @constructor
     * @param {DBInterface} db_handler - The database handler.
     * @returns {void}
     * @description Creates an instance of the IpsMongoRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(_TYPES.DBInterface) db_handler: DBInterface<Db>
    ) {
        this.db_handler = db_handler;
    }

    async find_all_by_distance_specialty_eps(
        longitude: number,
        latitude: number,
        max_distance: number,
        specialties: string[],
        eps_names: string[],
        page: number = 1,
        page_size: number = 10
    ): Promise<{ results: IPS[]; total: number }> {
        const _PIPELINE: PipelineStage[] = [{
            '$geoNear': {
                'near': {
                    'type': 'Point',
                    'coordinates': [longitude, latitude]
                },
                'distanceField': 'distance',
                'maxDistance': max_distance,
                'spherical': true
            }
        }];

        // Add match stage to filter by specialties
        if (specialties.length > 0) {
            _PIPELINE.push({
                '$lookup': {
                    'from': 'IPS_Specialty',
                    'localField': '_id',
                    'foreignField': 'ips_id',
                    'as': 'ips_specialties'
                }
            });
            _PIPELINE.push({
                '$lookup': {
                    'from': 'Specialty',
                    'localField': 'ips_specialties.specialty_id',
                    'foreignField': '_id',
                    'as': 'specialties'
                }
            });
            _PIPELINE.push({
                '$match': {
                    'specialties.name': {
                        '$in': specialties
                    }
                }
            });
            _PIPELINE.push({
                '$project': {
                    'name': 1,
                    'department': 1,
                    'town': 1,
                    'address': 1,
                    'phone': 1,
                    'email': 1,
                    'location': 1,
                    'level': 1,
                    'distance': 1
                }
            });
        }

        // Add match stage to filter by EPSs
        if (eps_names.length > 0) {
            _PIPELINE.push({
                '$lookup': {
                    'from': 'EPS_IPS',
                    'localField': '_id',
                    'foreignField': 'ips_id',
                    'as': 'eps_ips'
                }
            });
            _PIPELINE.push({
                '$lookup': {
                    'from': 'EPS',
                    'localField': 'eps_ips.eps_id',
                    'foreignField': '_id',
                    'as': 'eps'
                }
            });
            _PIPELINE.push({
                '$match': {
                    'eps.name': {
                        '$in': eps_names
                    }
                }
            });
            _PIPELINE.push({
                '$project': {
                    'name': 1,
                    'department': 1,
                    'town': 1,
                    'address': 1,
                    'phone': 1,
                    'email': 1,
                    'location': 1,
                    'level': 1,
                    'distance': 1
                }
            });
        }

        // Pagination
        _PIPELINE.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: (page - 1) * page_size },
                    { $limit: page_size }
                ]
            }
        });

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
            results: _RESULTS.map((ips) => new IPS(
                ips._id,
                ips.name,
                ips.department,
                ips.town,
                ips.address,
                ips.location,
                ips.phone,
                ips.email,
                ips.level,
                ips.distance
            )),
            total: _TOTAL
        };
    }
}