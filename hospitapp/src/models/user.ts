import { ObjectId } from "mongodb";
import { UserDocument, UserResponse } from "./user.interface";
import { UserMapper } from "@/utils/mappers/user_mapper";

/**
 * Class that defines the structure and behavior of the User entity.
 * @class EPS
 */

export class User {
    private _id: ObjectId;
    private email: string;
    private password: string;
    private phone: string;
    private eps: string;
    private role: string;

     /**
     * Creates an instance of EPS.
     * @param {ObjectId} _id - Unique identifier of the USER.
     * @param {string} email - Email of the USER.
     * @param {string} password - Password of the USER.
     * @param {string} phone - 01 8000 Phone number of the EPS.
     * @param {string} rol - Fax number of the EPS.
     * @param {string} eps - user eps.
     */
    constructor(_id: ObjectId = new ObjectId(), email: string, password: string,role: string, phone: string, eps: string) {
        this._id = _id;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.eps = eps;
        this.role = role;
    }

    /**
     * Validates the USER entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.eps || !this.email || !this.password || !this.phone) {
            throw new Error('Missing required fields');
        }
    }

    /**
     * Converts the USER entity to a plain object.
     * @returns {UserDocument} A plain object representation of the USER.
     */
    toObject(): UserDocument {
        return UserMapper.fromDomainToDocument(this);
    }
    
    /**
     * Converts the USER entity to a plain response object.
     * @returns {UserResponse} A plain response object representation of the USER.
     */
    toResponse(): UserResponse {
        return UserMapper.fromDomainToResponse(this);
    }
    
    /**
     * Gets the unique identifier of the USER.
     * @returns {ObjectId} The unique identifier of the USER.
     */
    getId(): ObjectId {
        return this._id;
    }
    
    /**
     * Gets the eps of the USER.
     * @returns {string} The username of the USER.
     */
    getEps(): string {
        return this.eps;
    }
    
    /**
     * Sets the eps of the USER.
     * 
     * @param {string} eps - The eps of the USER.
     * 
     * @throws {Error} If the eps is invalid.
     */
    setEps(eps: string): void {
        this.eps = eps;
    }
    /**
     * Gets the email of the USER.
     * @returns {string} The email of the USER.
     */
    getEmail(): string {
        return this.email;
    }
    
    /**
     * Sets the email of the USER.
     * 
     * @param {string} email - The email of the USER.
     * 
     * @throws {Error} If the email is invalid.
     */

    setEmail(email: string): void {
        this.email = email;
        this.validate();
    }
    
    /**
     * Gets the adress of the USER.
     * @returns {string} The adress of the USER.
     */
    getPhone(): string { 
        return this.phone;
    }

    /**
     * Sets the adress of the USER.
     * 
     * @param {string} adress - The adress of the USER.
     * 
     * @throws {Error} If the adress is invalid.
     */
    setAdress(phone: string): void {
        this.phone = phone;
        this.validate();
    }
    
    /**
     * Gets the password of the USER.
     *  @returns {string} The password of the USER.
     */
    getPassword(): string {
        return this.password;
    }
    
    setPassword(password: string): void {
        this.password = password;
        this.validate();
    }


    /**
     * Gets the role of the USER.
     * @returns {string} The role of the USER.
     */
    getRole(): string {
        return this.role;
    }
    
    /**
     * Sets the role of the USER.
     * 
     * @param {string} role - The role of the USER.
     * 
     * @throws {Error} If the role is invalid.
     */
    setRole(role: string): void {
        this.role = role;
        this.validate();
    }
    
    /**
     * Chek if the user password match with the password in the login request
     * @param {string} password - The password of the Login.
     */
    comparePassword(password: string): boolean {
        return this.password === password;
    }    

}
