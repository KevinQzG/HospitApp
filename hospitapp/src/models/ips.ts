import { ObjectId } from 'mongodb';

/**
 * Class that defines the structure and behavior of the IPS entity.
 * @class IPS
 */
export class IPS {
    private _id: ObjectId;
    private name: string;
    private department: string;
    private town: string;
    private address: string;
    private phone?: string;
    private email?: string;
    private location: {
        type: string;
        coordinates: [number, number];
    };
    private level?: number;
    private distance?: number;

    /**
     * Creates an instance of IPS.
     * @param {ObjectId} _id - Unique identifier of the IPS.
     * @param {string} name - Name of the IPS.
     * @param {string} department - Department where the IPS is located.
     * @param {string} town - Town where the IPS is located.
     * @param {string} address - Address of the IPS.
     * @param {object} location - Location of the IPS.
     * @param {string} location.type - Type of location.
     * @param {[number, number]} location.coordinates - Coordinates of the IPS.
     * @param {string} phone - Phone number of the IPS (optional).
     * @param {string} email - Email of the IPS (optional).
     * @param {number} level - Level of the IPS (optional).
     * @param {number} [distance] - Distance from the IPS to the user (optional).
     */
    constructor(_id: ObjectId = new ObjectId(), name: string, department: string, town: string, address: string,
        location: {
            type: string;
            coordinates: [number, number];
        },
        phone?: string,
        email?: string,
        level?: number,
        distance?: number
    ) {
        this._id = _id;
        this.name = name;
        this.department = department;
        this.town = town;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.location = location;
        this.level = level;
        this.distance = distance;
    }

    /**
     * Validates the IPS entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.name || !this.department || !this.town || !this.address || !this.location) {
            throw new Error('Missing required fields');
        }

        if (!this.location.type || this.location.type !== 'Point') {
            throw new Error('Invalid location type');
        }

        if (!this.location.coordinates || this.location.coordinates.length !== 2) {
            throw new Error('Invalid location coordinates');
        }
    }

    /**
     * Converts the IPS entity to a plain object.
     * @returns {Object} A plain object representation of the IPS.
     */
    toObject(): object {
        return {
            _id: this._id,
            name: this.name,
            department: this.department,
            town: this.town,
            address: this.address,
            phone: this.phone,
            email: this.email,
            location: this.location,
            level: this.level,
            distance: this.distance,
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
     * Gets the department where the IPS is located.
     * @returns {string} The department where the IPS is located.
     */
    getDepartment(): string {
        return this.department;
    }

    /**
     * Gets the town where the IPS is located.
     * @returns {string} The town where the IPS is located.
     */
    getTown(): string {
        return this.town;
    }

    /**
     * Gets the address of the IPS.
     * @returns {string} The address of the IPS.
     */
    getAddress(): string {
        return this.address;
    }

    /**
     * Gets the phone number of the IPS.
     * @returns {string} The phone number of the IPS.
     */
    getPhone(): string {
        return this.phone || '';
    }

    /**
     * Gets the email of the IPS.
     * @returns {string} The email of the IPS.
     */
    getEmail(): string {
        return this.email || '';
    }

    /**
     * Gets the location of the IPS.
     * @returns {Object} The location of the IPS.
     */
    getLocation(): object {
        return this.location;
    }

    /**
     * Gets the level of the IPS.
     * @returns {number} The level of the IPS.
     */
    getLevel(): number {
        return this.level || -1;
    }

    /**
     * Gets the distance from the IPS to the user.
     * @returns {number} The distance from the IPS to the user.
     */
    getDistance(): number {
        return this.distance || -1;
    }

    /**
     * Sets the distance from the IPS to the user.
     * @param {number} distance - The distance from the IPS to the user.
     */
    setDistance(distance: number): void {
        this.distance = distance;
    }

    /**
     * Sets the phone number of the IPS.
     * 
     * @param {string} phone - The phone number of the IPS.
     */
    setPhone(phone: string): void {
        this.phone = phone;
    }

    /**
     * Sets the email of the IPS.
     * 
     * @param {string} email - The email of the IPS.
     */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Sets the level of the IPS.
     * 
     * @param {number} level - The level of the IPS.
     * 
     * @throws {Error} If the level is invalid.
     */
    setLevel(level: number): void {
        if (level < 0) {
            throw new Error('Invalid level');
        }
        this.level = level;
    }

    /**
     * Sets the location of the IPS.
     * 
     * @param {Object} location - The location of the IPS.
     * @param {string} location.type - The type of location.
     * @param {[number, number]} location.coordinates - The coordinates of the IPS.
     */
    setLocation(location: {
        type: string;
        coordinates: [number, number];
    }): void {
        this.location =
            {
                type: location.type,
                coordinates: location.coordinates,
            };
    }

    /**
     * Sets the address of the IPS.
     * 
     * @param {string} address - The address of the IPS.
     * 
     * @throws {Error} If the address is invalid.
     */
    setAddress(address: string): void {
        this.address = address;
    }

    /**
     * Sets the town where the IPS is located.
     * 
     * @param {string} town - The town where the IPS is located.
     * 
     * @throws {Error} If the town is invalid.
     */
    setTown(town: string): void {
        this.town = town;
    }

    /**
     * Sets the department where the IPS is located.
     * 
     * @param {string} department - The department where the IPS is located.
     * 
     * @throws {Error} If the department is invalid.
     */
    setDepartment(department: string): void {
        this.department = department;
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
    }

    /**
     * Converts the IPS entity to a string.
     * @returns {string} A string representation of the IPS.
     */
    toString(): string {
        return JSON.stringify(this.toObject());
    }
}