export type PipelineStage =
    | { $geoNear: GeoNearStage }
    | { $lookup: LookupStage }
    | { $match: MatchStage }
    | { $project: ProjectStage }
    | { $facet: FacetStage };

export interface GeoNearStage {
    near: {
        type: 'Point';
        coordinates: [number, number];
    };
    distanceField: string;
    maxDistance: number;
    spherical: boolean;
}

export interface LookupStage {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
}

export interface MatchStage {
    [key: string]: { $in?: string[] } | unknown;
}

export interface ProjectStage {
    name?: number;
    department?: number;
    town?: number;
    address?: number;
    phone?: number;
    email?: number;
    location?: number;
    level?: number;
    distance?: number;
}

export interface FacetStage {
    metadata: [{ $count: string }];
    data: [{ $skip: number }, { $limit: number }];
}
