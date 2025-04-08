import { ReviewDocument } from "@/models/review.interface";

export interface AggregationResult {
	metadata?: { total: number }[];
	data?: ReviewDocument[];
}

export interface SortCriteria {
	field: string;
	direction: 1 | -1;
}
