import { ObjectId } from "mongodb";

export interface SpecialtyDocument {
    _id: ObjectId;
    name: string;
    schedule_monday?: string;
    schedule_tuesday?: string;
    schedule_wednesday?: string;
    schedule_thursday?: string;
    schedule_friday?: string;
    schedule_saturday?: string;
    schedule_sunday?: string
}

export interface SpecialtyResponse {
    _id: string;
    name: string;
    schedule_monday?: string;
    schedule_tuesday?: string;
    schedule_wednesday?: string;
    schedule_thursday?: string;
    schedule_friday?: string;
    schedule_saturday?: string;
    schedule_sunday?: string
}