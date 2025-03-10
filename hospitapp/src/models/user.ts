import { ObjectId } from "mongodb";
import { UserDocument, UserResponse } from "./user.interface";
import { UserMapper } from "@/utils/mappers/user_mapper";

/**
 * Class that defines the structure and behavior of the User entity.
 * @class EPS
 */

export class User {
    private _id: ObjectId;
    private username: string;
    private email: string;
    private password: string;
    private adress?: string;
    private role: string;

     /**
     * Creates an instance of EPS.
     * @param {ObjectId} _id - Unique identifier of the USER.
     * @param {string} username - username of the USER.
     * @param {string} phone - 01 8000 Phone number of the EPS.
     * @param {string} fax - Fax number of the EPS.
     * @param {string} emails - Email of the EPS.
     */
    constructor(_id: ObjectId = new ObjectId(), username: string, email: string, password: string,role: string, adress?: string) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.adress = adress;
        this.role = role;
    }

    /**
     * Validates the USER entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.username || !this.email || !this.password || !this.role) {
            throw new Error('Missing required fields');
        }
    }

    /**
     * Converts the USER entity to a plain object.
     * @returns {UserDocument} A plain object representation of the USER.
     */
    to_object(): UserDocument {
        return UserMapper.from_domain_to_document(this);
    }
    
    /**
     * Converts the USER entity to a plain response object.
     * @returns {UserResponse} A plain response object representation of the USER.
     */
    to_response(): UserResponse {
        return UserMapper.from_domain_to_response(this);
    }
    
    /**
     * Gets the unique identifier of the USER.
     * @returns {ObjectId} The unique identifier of the USER.
     */
    get_id(): ObjectId {
        return this._id;
    }
    
    /**
     * Gets the username of the USER.
     * @returns {string} The username of the USER.
     */
    get_username(): string {
        return this.username;
    }
    
    /**
     * Sets the username of the USER.
     * 
     * @param {string} username - The username of the USER.
     * 
     * @throws {Error} If the username is invalid.
     */
    set_username(username: string): void {
        this.username = username;
        this.validate();
    }
    
    /**
     * Gets the email of the USER.
     * @returns {string} The email of the USER.
     */
    get_email(): string {
        return this.email;
    }
    
    /**
     * Sets the email of the USER.
     * 
     * @param {string} email - The email of the USER.
     * 
     * @throws {Error} If the email is invalid.
     */

    set_email(email: string): void {
        this.email = email;
        this.validate();
    }
    
    /**
     * Gets the adress of the USER.
     * @returns {string} The adress of the USER.
     */
    get_address(): string | undefined{ 
        return this.adress;
    }

    /**
     * Sets the adress of the USER.
     * 
     * @param {string} adress - The adress of the USER.
     * 
     * @throws {Error} If the adress is invalid.
     */
    set_adress(adress: string): void {
        this.adress = adress;
        this.validate();
    }
    
    /**
     * Gets the password of the USER.
     *  @returns {string} The password of the USER.
     */
    get_password(): string {
        return this.password;
    }
    
    set_password(password: string): void {
        this.password = password;
        this.validate();
    }


    /**
     * Gets the role of the USER.
     * @returns {string} The role of the USER.
     */
    get_role(): string {
        return this.role;
    }
    
    /**
     * Sets the role of the USER.
     * 
     * @param {string} role - The role of the USER.
     * 
     * @throws {Error} If the role is invalid.
     */
    set_role(role: string): void {
        this.role = role;
        this.validate();
    }
    
    /**
     * Chek if the user password match with the password in the login request
     * @param {string} password - The password of the Login.
     */
    compare_password(password: string): boolean {
        return this.password === password;
    }    

}