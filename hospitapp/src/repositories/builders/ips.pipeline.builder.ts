import { PipelineStage } from "./ips.pipeline.interface";

/**
 * Class that allows to build a pipeline for IPS queries.
 * 
 * @class IpsPipelineBuilder
 */
export class IpsPipelineBuilder {
    private pipeline: PipelineStage[];

    constructor() {
        this.pipeline = [];
    }

    /**
     * Adds a geo stage to the pipeline.
     *
     * @param {number} longitude - Longitude of the user.
     * @param {number} latitude - Latitude of the user.
     * @param {number} max_distance - Maximum distance to search.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name add_geo_stage
     */
    add_geo_stage(longitude: number, latitude: number, max_distance: number): this {
        this.pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                distanceField: 'distance',
                maxDistance: max_distance,
                spherical: true
            }
        });

        return this;
    }

    /**
     * Adds a specialty filter to the pipeline.
     *
     * @param {string[]} specialties - The specialties to filter.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name matches_specialties
     */
    matches_specialties(specialties: string[]): this {
        if (specialties.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.specialty_lookup },
            { $lookup: this.specialty_join },
            { $match: { 'specialties.name': { $in: specialties } } },
            this.base_projection
        );
        
        return this;
    }

    /**
     * Adds an EPS filter to the pipeline.
     *
     * @param {string[]} eps_names - The EPS to filter.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name matches_eps
     */
    matches_eps(eps_names: string[]): this {
        if (eps_names.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.eps_lookup },
            { $lookup: this.eps_join },
            { $match: { 'eps.name': { $in: eps_names } } },
            this.base_projection
        );
        
        return this;
    }

    /**
     * Adds a pagination stage to the pipeline.
     *
     * @param {number} page - The page number.
     * @param {number} page_size - The page size.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name with_pagination
     */
    with_pagination(page: number, page_size: number): this {
        this.pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: (page - 1) * page_size },
                    { $limit: page_size }
                ]
            }
        });
        
        return this;
    }

    build(): PipelineStage[] {
        return [...this.pipeline];
    }

    // Shared pipeline stages
    private get specialty_lookup() {
        return {
            from: 'IPS_Specialty',
            localField: '_id',
            foreignField: 'ips_id',
            as: 'ips_specialties'
        };
    }

    private get specialty_join() {
        return {
            from: 'Specialty',
            localField: 'ips_specialties.specialty_id',
            foreignField: '_id',
            as: 'specialties'
        };
    }

    private get eps_lookup() {
        return {
            from: 'EPS_IPS',
            localField: '_id',
            foreignField: 'ips_id',
            as: 'eps_ips'
        };
    }

    private get eps_join() {
        return {
            from: 'EPS',
            localField: 'eps_ips.eps_id',
            foreignField: '_id',
            as: 'eps'
        };
    }

    private get base_projection() {
        return {
            $project: {
                name: 1,
                department: 1,
                town: 1,
                address: 1,
                phone: 1,
                email: 1,
                location: 1,
                level: 1,
                distance: 1
            }
        };
    }
}