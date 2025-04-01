import { ObjectId } from 'mongodb';
import { IpsDocument, IpsResponse } from './ips.interface';
import { Eps } from './eps';
import { Specialty } from './specialty';
import { IpsMapper } from '@/utils/mappers/ips_mapper';
import { Review } from './review';


/**
 * Class that defines the structure and behavior of the IPS entity.
 * @class IPS
 */
export class Ips {
    private _id: ObjectId;
    private name: string;
    private department: string;
    private town: string;
    private address: string;
    private phone?: string | number;
    private email?: string;
    private location: {
        type: string;
        coordinates: [number, number];
    };
    private level?: number;
    private distance?: number;
    private eps?: Eps[];
    private specialties?: Specialty[];
    private reviews?: Review[];

    /**
     * Creates an instance of IPS.
     * @param {ObjectId} _id - Unique identifier of the IPS. (optional)
     * @param {string} name - Name of the IPS.
     * @param {string} department - Department where the IPS is located.
     * @param {string} town - Town where the IPS is located.
     * @param {string} address - Address of the IPS.
     * @param {object} location - Location of the IPS.
     * @param {string} location.type - Type of location.
     * @param {[number, number]} location.coordinates - Coordinates of the IPS.
     * @param {string | number} phone - Phone number of the IPS (optional).
     * @param {string} email - Email of the IPS (optional).
     * @param {number} level - Level of the IPS (optional).
     * @param {number} [distance] - Distance from the IPS to the user (optional).
     * @param {Eps[]} [eps] - EPS entities associated with the IPS (optional).
     * @param {Specialty[]} [specialties] - Specialty entities associated with the IPS (optional).
     * @param {Review[]} [reviews] - Reviews associated with the IPS (optional).
     */
    constructor(_id: ObjectId = new ObjectId(), name: string, department: string, town: string, address: string,
        location: {
            type: string;
            coordinates: [number, number];
        },
        phone?: string | number,
        email?: string,
        level?: number,
        distance?: number,
        eps?: Eps[],
        specialties?: Specialty[],
        reviews?: Review[]
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
        this.eps = eps;
        this.specialties = specialties;
        this.reviews = reviews;
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
     * @returns {IpsDocument} A plain object representation of the IPS.
     */
    toObject(): IpsDocument {
        return IpsMapper.fromDomainToDocument(this);
    }

    /**
     * Converts the IPS entity to a plain response object.
     * @returns {IpsResponse} A plain response object representation of the IPS.
     */
    toResponse(): IpsResponse {
        return IpsMapper.fromDomainToResponse(this);
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
     * @returns {string | number | undefined} The phone number of the IPS.
     */
    getPhone(): string | number | undefined{
        return this.phone;
    }

    /**
     * Gets the email of the IPS.
     * @returns {string | undefined} The email of the IPS.
     */
    getEmail(): string | undefined {
        return this.email;
    }

    /**
     * Gets the location of the IPS.
     * @returns {Object} The location of the IPS.
     * @property {string} type - The type of location.
     * @property {[number, number]} coordinates - The coordinates of the IPS.
     */
    getLocation(): {
        type: string;
        coordinates: [number, number];
    } {
        return this.location;
    }

    /**
     * Gets the level of the IPS.
     * @returns {number | undefined} The level of the IPS.
     */
    getLevel(): number | undefined {
        return this.level;
    }

    /**
     * Gets the distance from the IPS to the user.
     * @returns {number | undefined} The distance from the IPS to the user.
     */
    getDistance(): number | undefined {
        return this.distance;
    }

    /**
     * Gets the EPS entities associated with the IPS.
     * @returns {Eps[] | undefined} The EPS entities associated with the IPS.
     */
    getEps(): Eps[] | undefined {
        return this.eps;
    }

    /**
     * Gets the Specialty entities associated with the IPS.
     * @returns {Specialty[] | undefined} The Specialty entities associated with the IPS.
     */
    getSpecialties(): Specialty[] | undefined {
        return this.specialties;
    }

    /**
     * Gets the reviews associated with the IPS.
     * @returns {Review[] | undefined} The reviews associated with the IPS.
     */
    getReviews(): Review[] | undefined {
        return this.reviews;
    }

    /**
     * Adds a Review entity to the IPS.
     * 
     * @param {Review} review - The Review entity to add.
     * 
     * @throws {Error} If the Review entity is invalid.
     */
    addReview(review: Review): void {
        if (!review) {
            throw new Error('Invalid Review entity');
        }
        if (!this.reviews) {
            this.reviews = [];
        }
        this.reviews.push(review);
    }

    /**
     * Adds a Specialty entity to the IPS.
     * 
     * @param {Specialty} specialty - The Specialty entity to add.
     * 
     * @throws {Error} If the Specialty entity is invalid.
     */
    addSpecialty(specialty: Specialty): void {
        if (!specialty) {
            throw new Error('Invalid Specialty entity');
        }
        if (!this.specialties) {
            this.specialties = [];
        }
        this.specialties.push(specialty);
    }

    /**
     * Adds an EPS entity to the IPS.
     * 
     * @param {Eps} eps - The EPS entity to add.
     *  
     * @throws {Error} If the EPS entity is invalid.
     */
    addEps(eps: Eps): void {
        if (!eps) {
            throw new Error('Invalid EPS entity');
        }
        if (!this.eps) {
            this.eps = [];
        }
        this.eps.push(eps);
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
        this.validate();
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
        this.validate();
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
        this.validate();
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
        this.validate();
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