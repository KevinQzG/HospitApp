import { ObjectId } from "mongodb";

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
    name?: 1;
    department?: 1;
    town?: 1;
    address?: 1;
    phone?: 1;
    email?: 1;
    location?: 1;
    level?: 1;
    distance?: 1;
}

export interface FacetStage {
    metadata: [{ $count: string }];
    data: [{ $skip: number }, { $limit: number }];
}

export interface IPSDocument {
    _id: ObjectId;
    name: string;
    department: string;
    town: string;
    address: string;
    phone?: string | number;
    email?: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    level?: number;
    distance?: number;
}

export interface AggregationResult {
    metadata?: { total: number }[];
    data?: IPSDocument[];
}
