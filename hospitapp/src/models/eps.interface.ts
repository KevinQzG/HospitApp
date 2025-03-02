import { ObjectId } from "mongodb";

export interface EPSDocument {
    _id: ObjectId;
    name: string;
}