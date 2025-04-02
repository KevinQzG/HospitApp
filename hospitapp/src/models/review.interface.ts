import { ObjectId } from "mongodb";

export interface ReviewDocument {
	_id: ObjectId;
	user: ObjectId;
	ips: ObjectId;
	rating: number;
	comments: string;
	userEmail?: string;
}

export interface ReviewResponse {
	_id: string;
	user: string;
	ips: string;
	rating: number;
	comments: string;
	userEmail?: string;
}
