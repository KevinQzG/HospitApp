import { ObjectId } from "mongodb";
import { EPSDocument } from "./eps.interface";

export interface IPSDocument {
    _id: ObjectId;
    name: string;
    department: string;
    town: string;
    address: string;
    phone?: string | number;
    email?: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    level?: number;
    distance?: number;
    eps?: EPSDocument[];
}