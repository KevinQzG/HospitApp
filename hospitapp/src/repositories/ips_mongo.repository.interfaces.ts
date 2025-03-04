import { IpsDocument } from "@/models/ips.interface";

export interface AggregationResult {
    metadata?: { total: number }[];
    data?: IpsDocument[];
}
