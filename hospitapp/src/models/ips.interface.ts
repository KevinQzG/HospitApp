import { ObjectId } from "mongodb";
import { EPSDocument, EPSResponse } from "./eps.interface";
import { SpecialtyDocument, SpecialtyResponse } from "./specialty.interface";

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
    specialties?: SpecialtyDocument[];
}

export interface IPSResponse {
    _id: string;
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
    eps?: EPSResponse[];
    specialties?: SpecialtyResponse[];
}