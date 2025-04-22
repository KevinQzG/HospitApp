import { IpsDocument } from "@/models/ips.interface";

export interface AggregationResult {
	metadata?: { total: number }[];
	data?: IpsDocument[];
}

export interface SortCriteria {
	field: string;
	direction: 1 | -1;
}
