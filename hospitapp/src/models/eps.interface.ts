import { ObjectId } from "mongodb";

export interface EPSDocument {
    _id: ObjectId;
    name: string;
    "01_8000_phone": string;
    fax: string;
    emails: string;
}

export interface EPSResponse {
    _id: string;
    name: string;
    "01_8000_phone": string;
    fax: string;
    emails: string;
}