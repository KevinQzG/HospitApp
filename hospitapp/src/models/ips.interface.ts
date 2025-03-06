import { ObjectId } from "mongodb";
import { EpsDocument, EpsResponse } from "./eps.interface";
import { SpecialtyDocument, SpecialtyResponse } from "./specialty.interface";

export interface IpsDocument {
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
    eps?: EpsDocument[];
    specialties?: SpecialtyDocument[];
}

export interface IpsResponse {
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
    eps?: EpsResponse[];
    specialties?: SpecialtyResponse[];
    maps?: string;
    waze?: string;
}