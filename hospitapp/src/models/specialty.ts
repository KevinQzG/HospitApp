import { ObjectId } from 'mongodb';
import { SpecialtyDocument, SpecialtyResponse } from './specialty.interface';
import { SpecialtyMapper } from '@/utils/mappers/specialty_mapper';

/**
 * Class that defines the structure and behavior of the Specialty entity.
 * @class Specialty
 */
export class Specialty {
    private _id: ObjectId;
    private name: string;
    private schedule_monday?: string;
    private schedule_tuesday?: string;
    private schedule_wednesday?: string;
    private schedule_thursday?: string;
    private schedule_friday?: string;
    private schedule_saturday?: string;
    private schedule_sunday?: string;

    /**
     * Creates an instance of Specialty.
     * @param {ObjectId} _id - Unique identifier of the Specialty.
     * @param {string} name - Name of the Specialty.
     * @param {string} schedule_monday - Monday schedule of the Specialty. (optional)
     * @param {string} schedule_tuesday - Tuesday schedule of the Specialty. (optional) 
     * @param {string} schedule_wednesday - Wednesday schedule of the Specialty. (optional)
     * @param {string} schedule_thursday - Thursday schedule of the Specialty. (optional)
     * @param {string} schedule_friday - Friday schedule of the Specialty. (optional)
     * @param {string} schedule_saturday - Saturday schedule of the Specialty. (optional)
     * @param {string} schedule_sunday - Sunday schedule of the Specialty. (optional)
     */
    constructor(_id: ObjectId = new ObjectId(), name: string, schedule_monday?: string, schedule_tuesday?: string, schedule_wednesday?: string, schedule_thursday?: string, schedule_friday?: string, schedule_saturday?: string, schedule_sunday?: string) {
        this._id = _id;
        this.name = name;
        this.schedule_monday = schedule_monday;
        this.schedule_tuesday = schedule_tuesday;
        this.schedule_wednesday = schedule_wednesday;
        this.schedule_thursday = schedule_thursday;
        this.schedule_friday = schedule_friday;
        this.schedule_saturday = schedule_saturday;
        this.schedule_sunday = schedule_sunday;
    }

    /**
     * Validates the Specialty entity.
     * @throws {Error} If any required field is missing or invalid.
     */
    validate(): void {
        if (!this.name) {
            throw new Error('Missing required fields');
        }
    }

    /**
     * Converts the Specialty entity to a plain object.
     * @returns {SpecialtyDocument} A plain object representation of the Specialty.
     */
    to_object(): SpecialtyDocument {
        return SpecialtyMapper.from_domain_to_document(this);
    }

    /**
     * Converts the Specialty entity to a plain object.
     * @returns {SpecialtyResponse} A plain object representation of the Specialty.
     */
    to_response(): SpecialtyResponse {
        return SpecialtyMapper.from_domain_to_response(this);
    }

    /**
     * Gets the unique identifier of the Specialty.
     * @returns {ObjectId} The unique identifier of the Specialty.
     */
    getId(): ObjectId {
        return this._id;
    }

    /**
     * Gets the name of the Specialty.
     * @returns {string} The name of the Specialty.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the Specialty.
     * 
     * @param {string} name - The name of the Specialty.
     * 
     * @throws {Error} If the name is invalid.
     */
    setName(name: string): void {
        this.name = name;
        this.validate();
    }

    /**
     * Gets the Monday schedule of the Specialty.
     * @returns {string | undefined} The Monday schedule of the Specialty.
     */
    getScheduleMonday(): string | undefined {
        return this.schedule_monday;
    }

    /**
     * Sets the Monday schedule of the Specialty.
     * 
     * @param {string} schedule_monday - The Monday schedule of the Specialty.
     */
    setScheduleMonday(schedule_monday: string): void {
        this.schedule_monday = schedule_monday;
    }

    /**
     * Gets the Tuesday schedule of the Specialty.
     * @returns {string | undefined} The Tuesday schedule of the Specialty.
     */
    getScheduleTuesday(): string | undefined {
        return this.schedule_tuesday;
    }

    /**
     * Sets the Tuesday schedule of the Specialty.
     * 
     * @param {string} schedule_tuesday - The Tuesday schedule of the Specialty.
     */
    setScheduleTuesday(schedule_tuesday: string): void {
        this.schedule_tuesday = schedule_tuesday;
    }

    /**
     * Gets the Wednesday schedule of the Specialty.
     * @returns {string | undefined} The Wednesday schedule of the Specialty.
     */
    getScheduleWednesday(): string | undefined {
        return this.schedule_wednesday;
    }

    /**
     * Sets the Wednesday schedule of the Specialty.
     * 
     * @param {string} schedule_wednesday - The Wednesday schedule of the Specialty.
     */
    setScheduleWednesday(schedule_wednesday: string): void {
        this.schedule_wednesday = schedule_wednesday;
    }

    /**
     * Gets the Thursday schedule of the Specialty.
     * @returns {string | undefined} The Thursday schedule of the Specialty.
     */
    getScheduleThursday(): string | undefined {
        return this.schedule_thursday;
    }

    /**
     * Sets the Thursday schedule of the Specialty.
     * 
     * @param {string} schedule_thursday - The Thursday schedule of the Specialty.
     */
    setScheduleThursday(schedule_thursday: string): void {
        this.schedule_thursday = schedule_thursday;
    }

    /**
     * Gets the Friday schedule of the Specialty.
     * @returns {string | undefined} The Friday schedule of the Specialty.
     */
    getScheduleFriday(): string | undefined {
        return this.schedule_friday;
    }

    /**
     * Sets the Friday schedule of the Specialty.
     * 
     * @param {string} schedule_friday - The Friday schedule of the Specialty.
     */
    setScheduleFriday(schedule_friday: string): void {
        this.schedule_friday = schedule_friday;
    }

    /**
     * Gets the Saturday schedule of the Specialty.
     * @returns {string | undefined} The Saturday schedule of the Specialty.
     */
    getScheduleSaturday(): string | undefined {
        return this.schedule_saturday;
    }

    /**
     * Sets the Saturday schedule of the Specialty.
     * 
     * @param {string} schedule_saturday - The Saturday schedule of the Specialty.
     */
    setScheduleSaturday(schedule_saturday: string): void {
        this.schedule_saturday = schedule_saturday;
    }

    /**
     * Gets the Sunday schedule of the Specialty.
     * @returns {string | undefined} The Sunday schedule of the Specialty.
     */
    getScheduleSunday(): string | undefined {
        return this.schedule_sunday;
    }

    /**
     * Converts the Specialty entity to a string.
     * @returns {string} A string representation of the IPS.
     */
    toString(): string {
        return JSON.stringify(this.to_object());
    }
}