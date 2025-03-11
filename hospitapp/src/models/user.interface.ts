import { ObjectId } from "mongodb";


export interface UserDocument {
    _id: ObjectId;
    password: string;
    phone: string;
    email: string;
    role: string;
    eps: string;
}

export interface UserResponse {
    _id: string;
    phone: string;
    password: string;
    email: string;
    role: string;
    eps: string;
    
}