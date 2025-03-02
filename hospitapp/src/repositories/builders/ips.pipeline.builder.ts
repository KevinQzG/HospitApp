import { PipelineStage } from "./ips.pipeline.interface";

export class IpsPipelineBuilder {
    private pipeline: PipelineStage[];

    constructor() {
        this.pipeline = [];
    }

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

    with_specialties(specialties: string[]): this {
        if (specialties.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.specialty_lookup },
            { $lookup: this.specialty_join },
            { $match: { 'specialties.name': { $in: specialties } } },
            this.base_projection
        );
        
        return this;
    }

    with_eps(eps_names: string[]): this {
        if (eps_names.length === 0) return this;

        this.pipeline.push(
            { $lookup: this.eps_lookup },
            { $lookup: this.eps_join },
            { $match: { 'eps.name': { $in: eps_names } } },
            this.base_projection
        );
        
        return this;
    }

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