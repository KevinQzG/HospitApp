import { ObjectId } from "mongodb";

export interface EpsDocument {
    _id: ObjectId;
    name: string;
    "01_8000_phone": string;
    fax: string;
    emails: string;
}

export interface EpsResponse {
    _id: string;
    name: string;
    "01_8000_phone": string;
    fax: string;
    emails: string;
}