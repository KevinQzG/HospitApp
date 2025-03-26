import { ObjectId } from 'mongodb';
import { EpsDocument, EpsResponse } from './eps.interface';
import { EpsMapper } from '@/utils/mappers/eps_mapper';

/**
 * Class that defines the structure and behavior of the EPS entity.
 * @class EPS
 */
export class Eps {
    private _id: ObjectId;
    private name: string;
    private phone: string;
    private fax: string;
    private emails: string;

    /**
     * Creates an instance of EPS.
     * @param {ObjectId} _id - Unique identifier of the EPS.
     * @param {string} name - Name of the EPS.
     * @param {string} phone - 01 8000 Phone number of the EPS.
     * @param {string} fax - Fax number of the EPS.
     * @param {string} emails - Email of the EPS.
     */
    constructor(_id: ObjectId = new ObjectId(), name: string, phone: string, fax: string, emails: string) {
        this._id = _id;
        this.name = name;
        this.phone = phone;
        this.fax = fax;
        this.emails = emails;
    }

    /**
     * Validates the EPS entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.name || !this.phone || !this.fax || !this.emails) {
            throw new Error('Missing required fields');
        }
    }

    /**
     * Converts the EPS entity to a plain object.
     * @returns {EpsDocument} A plain object representation of the EPS.
     */
    toObject(): EpsDocument {
        return EpsMapper.fromDomainToDocument(this);
    }

    /**
     * Converts the EPS entity to a plain response object.
     * @returns {EpsResponse} A plain response object representation of the EPS.
     */
    toResponse(): EpsResponse {
        return EpsMapper.fromDomainToResponse(this);
    }    

    /**
     * Gets the unique identifier of the EPS.
     * @returns {ObjectId} The unique identifier of the EPS.
     */
    getId(): ObjectId {
        return this._id;
    }

    /**
     * Gets the name of the EPS.
     * @returns {string} The name of the EPS.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the EPS.
     * 
     * @param {string} name - The name of the EPS.
     * 
     * @throws {Error} If the name is invalid.
     */
    setName(name: string): void {
        this.name = name;
        this.validate();
    }


    /**
     * Gets the phone number of the EPS.
     * @returns {string} The phone number of the EPS.
     */
    getPhone(): string {
        return this.phone;
    }

    /**
     * Sets the phone number of the EPS.
     * 
     * @param {string} phone - The phone number of the EPS.
     * 
     * @throws {Error} If the phone number is invalid.
     */
    setPhone(phone: string): void {
        this.phone = phone;
        this.validate();
    }

    /**
     * Gets the fax number of the EPS.
     * @returns {string} The fax number of the EPS.
     */
    getFax(): string {
        return this.fax;
    }

    /**
     * Sets the fax number of the EPS.
     * 
     * @param {string} fax - The fax number of the EPS.
     * 
     * @throws {Error} If the fax number is invalid.
     */
    setFax(fax: string): void {
        this.fax = fax;
        this.validate();
    }

    /**
     * Gets the email of the EPS.
     * @returns {string} The email of the EPS.
     */
    getEmails(): string {
        return this.emails;
    }

    /**
     * Sets the email of the EPS.
     * 
     * @param {string} emails - The email of the EPS.
     * 
     * @throws {Error} If the email is invalid.
     */
    setEmails(emails: string): void {
        this.emails = emails;
        this.validate();
    }

    /**
     * Converts the EPS entity to a string.
     * @returns {string} A string representation of the EPS.
     */
    toString(): string {
        return JSON.stringify(this.toObject());
    }
}