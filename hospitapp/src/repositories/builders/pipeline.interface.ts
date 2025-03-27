import { ObjectId } from 'mongodb';

export type PipelineStage =
    | { $geoNear: GeoNearStage }
    | { $lookup: LookupStage }
    | { $match: MatchStage }
    | { $project: ProjectStage }
    | { $facet: FacetStage }
    | { $addFields: AddFieldsStage }
    | { $sort: SortStage };

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
    [key: string]: { $in?: string[] } | ObjectId | string;
}

export interface ProjectStage {
    [key: string]: number | {
        $sortArray: {
            input: string;
            sortBy: SortStage;
        }
    }
}

export interface SortStage {
    [key: string]: number;
}

export interface AddFieldsStage {
    [key: string]: unknown | {
        $map: {
            input: string,
            as: string,
            in: {
                [key: string]: {
                    $let: {
                        vars: {
                            matched: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: string,
                                            as: string,
                                            cond: {
                                                $eq: [
                                                    string,
                                                    string
                                                ] | unknown
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        },
                        in: string | unknown
                    }
                } | string,
            }
        }
    };
}

export interface FacetStage {
    metadata: [{ $count: string }];
    data: [{ $skip: number }, { $limit: number }];
}
