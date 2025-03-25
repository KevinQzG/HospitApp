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
     * @param {number} maxDistance - Maximum distance to search.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name add_geo_stage
     */
    addGeoStage(longitude: number | null, latitude: number | null, maxDistance: number | null): this {
        if (longitude === null || latitude === null || maxDistance === null) return this;

        this.pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                distanceField: 'distance',
                maxDistance: maxDistance,
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
    addMatchNameStage(name: string): this {
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
    withEps(): this {
        this.pipeline.push(
            { $lookup: this.epsLookup },
            { $lookup: this.epsJoin },
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
    withSpecialties(): this {
        this.pipeline.push(
            { $lookup: this.specialtyLookup },
            { $lookup: this.specialtyJoin },
            { $addFields: this.specialtyAddFieldsNameSchedules },
            { $project: { specialtyDetails: 0 } }
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
    matchesSpecialties(specialties: string[]): this {
        if (specialties.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.specialtyLookup },
            { $lookup: this.specialtyJoin },
            { $match: { 'specialty_details.name': { $in: specialties } } },
            { $project: this.baseProjection }
        );

        return this;
    }

    /**
     * Adds an EPS filter to the pipeline.
     *
     * @param {string[]} epsNames - The EPS to filter.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name matches_eps
     */
    matchesEps(epsNames: string[]): this {
        if (epsNames.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.epsLookup },
            { $lookup: this.epsJoin },
            { $match: { 'eps.name': { $in: epsNames } } },
            { $project: this.baseProjection }
        );

        return this;
    }

    /**
     * Adds a pagination stage to the pipeline.
     *
     * @param {number} page - The page number.
     * @param {number} pageSize - The page size.
     * @returns {IpsPipelineBuilder} The builder instance.
     * @memberof IpsPipelineBuilder
     * @public
     * @method
     * @name with_pagination
     */
    withPagination(page: number, pageSize: number): this {
        this.pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize }
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
    private get specialtyLookup(): LookupStage {
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
    private get specialtyJoin(): LookupStage {
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
    private get epsLookup(): LookupStage {
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
    private get epsJoin(): LookupStage {
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
    private get baseProjection(): ProjectStage {
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
    private get specialtyAddFieldsNameSchedules(): AddFieldsStage {
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
                        "schedule_monday": "$$s.schedule_monday",
                        "schedule_tuesday": "$$s.schedule_tuesday",
                        "schedule_wednesday":
                            "$$s.schedule_wednesday",
                        "schedule_thursday":
                            "$$s.schedule_thursday",
                        "schedule_friday": "$$s.schedule_friday",
                        "schedule_saturday":
                            "$$s.schedule_saturday",
                        "schedule_sunday": "$$s.schedule_sunday"
                    }
                }
            }
        };
    }
}