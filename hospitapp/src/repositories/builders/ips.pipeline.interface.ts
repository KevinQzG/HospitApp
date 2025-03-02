import { ObjectId } from 'mongodb';

export type PipelineStage =
    | { $geoNear: GeoNearStage }
    | { $lookup: LookupStage }
    | { $match: MatchStage}
    | { $project: ProjectStage }
    | { $facet: FacetStage };

interface GeoNearStage {
    near: {
        type: 'Point';
        coordinates: [number, number];
    };
    distanceField: string;
    maxDistance: number;
    spherical: boolean;
}

interface LookupStage {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
}

interface MatchStage {
    [key: string]: { $in?: string[] } | ObjectId | unknown;
}

interface ProjectStage {
    name?: number;
    department?: number;
    town?: number;
    address?: number;
    phone?: number;
    email?: number;
    location?: number;
    level?: number;
    distance?: number;
    eps_ips?: number;
}

interface FacetStage {
    metadata: [{ $count: string }];
    data: [{ $skip: number }, { $limit: number }];
}
