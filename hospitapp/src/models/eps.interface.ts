import { ObjectId } from "mongodb";

export interface EPSDocument {
    _id: ObjectId;
    name: string;
    "01_8000_phone": string;
    fax: string;
    emails: string;
}