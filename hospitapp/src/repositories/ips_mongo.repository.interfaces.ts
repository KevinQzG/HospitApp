import { IPSDocument } from "@/models/ips.interface";

export interface AggregationResult {
    metadata?: { total: number }[];
    data?: IPSDocument[];
}
