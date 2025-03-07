import { ObjectId } from "mongodb";
import { PipelineStage, LookupStage, AddFieldsStage, ProjectStage } from "./ips.pipeline.interface";

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
    add_geo_stage(longitude: number | null, latitude: number | null, max_distance: number | null): this {
        if (longitude === null || latitude === null || max_distance === null) return this;

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
     * Adds a match stage to the pipeline.
     *
     * @param {string} name - The name to match.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name add_match_name_stage
     */
    add_match_name_stage(name: string): this {
        this.pipeline.push({
            $match: { name: name }
        });

        return this;
    }

    /**
     * Adds an EPS join to the pipeline.
     *
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name with_eps
     */
    with_eps(): this {
        this.pipeline.push(
            { $lookup: this.eps_lookup },
            { $lookup: this.eps_join },
            { $project: { eps_ips: 0 } }
        );

        return this;
    }

    /**
     * Adds a specialty join to the pipeline.
     *
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name with_specialties
     */
    with_specialties(): this {
        this.pipeline.push(
            { $lookup: this.specialty_lookup },
            { $lookup: this.specialty_join },
            { $addFields: this.specialty_add_fields_name_schedules },
            { $project: { specialty_details: 0 } }
        );

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
            { $match: { 'specialty_details.name': { $in: specialties } } },
            { $project: this.base_projection }
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
            { $project: this.base_projection }
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

    /**
     * Returns the pipeline stages.
     * @returns {PipelineStage[]} The pipeline stages.
     */
    build(): PipelineStage[] {
        return [...this.pipeline];
    }

    /**
     * Returns the lookup stage for specialties.
     * @returns {LookupStage} The lookup stage.
     */
    private get specialty_lookup(): LookupStage {
        return {
            from: 'IPS_Specialty',
            localField: '_id',
            foreignField: 'ips_id',
            as: 'specialties'
        };
    }

    /**
     * Returns the lookup stage for specialties.
     * @returns {LookupStage} The lookup stage.
     */
    private get specialty_join(): LookupStage {
        return {
            from: 'Specialty',
            localField: 'specialties.specialty_id',
            foreignField: '_id',
            as: 'specialty_details'
        };
    }

    /**
     * Returns the lookup stage for EPS.
     * @returns {LookupStage} The lookup stage.
     */
    private get eps_lookup(): LookupStage {
        return {
            from: 'EPS_IPS',
            localField: '_id',
            foreignField: 'ips_id',
            as: 'eps_ips'
        };
    }

    /**
     * Returns the lookup stage for EPS.
     * @returns {LookupStage} The lookup stage.
     */
    private get eps_join(): LookupStage {
        return {
            from: 'EPS',
            localField: 'eps_ips.eps_id',
            foreignField: '_id',
            as: 'eps'
        };
    }

    /**
     * Returns the base projection for the pipeline.
     * @returns {ProjectStage} The projection stage.
     */
    private get base_projection(): ProjectStage {
        return {
            name: 1,
            department: 1,
            town: 1,
            address: 1,
            phone: 1,
            email: 1,
            location: 1,
            level: 1,
            distance: 1
        };
    }

    /**
     * Returns the add fields stage for specialties.
     * @returns {AddFieldsStage} The add fields stage.
     */
    private get specialty_add_fields_name_schedules(): AddFieldsStage {
        return {
            specialties: {
                $map: {
                    input: "$specialties",
                    as: "s",
                    in: {
                        _id: {
                            $let: {
                                vars: {
                                    matched: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$specialty_details",
                                                    as: "sp",
                                                    cond: {
                                                        $eq: [
                                                            "$$sp._id",
                                                            "$$s.specialty_id"
                                                        ]
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: "$$matched._id"
                            }
                        },
                        name: {
                            $let: {
                                vars: {
                                    matched: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$specialty_details",
                                                    as: "sp",
                                                    cond: {
                                                        $eq: [
                                                            "$$sp._id",
                                                            "$$s.specialty_id"
                                                        ]
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: "$$matched.name"
                            }
                        },
                        schedule_monday: "$$s.schedule_monday",
                        schedule_tuesday: "$$s.schedule_tuesday",
                        schedule_wednesday:
                            "$$s.schedule_wednesday",
                        schedule_thursday:
                            "$$s.schedule_thursday",
                        schedule_friday: "$$s.schedule_friday",
                        schedule_saturday:
                            "$$s.schedule_saturday",
                        schedule_sunday: "$$s.schedule_sunday"
                    }
                }
            }
        };
    }
}