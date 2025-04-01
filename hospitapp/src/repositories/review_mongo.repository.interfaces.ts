import { ReviewDocument } from "@/models/review.interface";

export interface AggregationResult {
    metadata?: { total: number }[];
    data?: ReviewDocument[];
}
