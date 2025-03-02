import { ObjectId } from 'mongodb';
import { EPSDocument } from './eps.interface';

/**
 * Class that defines the structure and behavior of the EPS entity.
 * @class EPS
 */
export class EPS {
    private _id: ObjectId;
    private name: string;

    /**
     * Creates an instance of EPS.
     * @param {ObjectId} _id - Unique identifier of the EPS.
     * @param {string} name - Name of the EPS.
     */
    constructor(_id: ObjectId = new ObjectId(), name: string) {
        this._id = _id;
        this.name = name;
    }

    /**
     * Validates the IPS entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.name) {
            throw new Error('Missing required fields');
        }
    }

    /**
     * Converts the IPS entity to a plain object.
     * @returns {EPSDocument} A plain object representation of the IPS.
     */
    toObject(): EPSDocument {
        return {
            _id: this._id,
            name: this.name,
        };
    }

    /**
     * Gets the unique identifier of the IPS.
     * @returns {ObjectId} The unique identifier of the IPS.
     */
    getId(): ObjectId {
        return this._id;
    }

    /**
     * Gets the name of the IPS.
     * @returns {string} The name of the IPS.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the IPS.
     * 
     * @param {string} name - The name of the IPS.
     * 
     * @throws {Error} If the name is invalid.
     */
    setName(name: string): void {
        this.name = name;
        this.validate();
    }

    /**
     * Converts the IPS entity to a string.
     * @returns {string} A string representation of the IPS.
     */
    toString(): string {
        return JSON.stringify(this.toObject());
    }
}