import { ObjectId } from "mongodb";


export interface UserDocument {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    role: string;
    address?: string;
}

export interface UserResponse {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    address?: string;
}