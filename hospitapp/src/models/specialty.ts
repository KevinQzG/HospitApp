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
    private scheduleMonday?: string;
    private scheduleTuesday?: string;
    private scheduleWednesday?: string;
    private scheduleThursday?: string;
    private scheduleFriday?: string;
    private scheduleSaturday?: string;
    private scheduleSunday?: string;

    /**
     * Creates an instance of Specialty.
     * @param {ObjectId} _id - Unique identifier of the Specialty.
     * @param {string} name - Name of the Specialty.
     * @param {string} scheduleMonday - Monday schedule of the Specialty. (optional)
     * @param {string} scheduleTuesday - Tuesday schedule of the Specialty. (optional) 
     * @param {string} scheduleWednesday - Wednesday schedule of the Specialty. (optional)
     * @param {string} scheduleThursday - Thursday schedule of the Specialty. (optional)
     * @param {string} scheduleFriday - Friday schedule of the Specialty. (optional)
     * @param {string} scheduleSaturday - Saturday schedule of the Specialty. (optional)
     * @param {string} scheduleSunday - Sunday schedule of the Specialty. (optional)
     */
    constructor(_id: ObjectId = new ObjectId(), name: string, scheduleMonday?: string, scheduleTuesday?: string, scheduleWednesday?: string, scheduleThursday?: string, scheduleFriday?: string, scheduleSaturday?: string, scheduleSunday?: string) {
        this._id = _id;
        this.name = name;
        this.scheduleMonday = scheduleMonday;
        this.scheduleTuesday = scheduleTuesday;
        this.scheduleWednesday = scheduleWednesday;
        this.scheduleThursday = scheduleThursday;
        this.scheduleFriday = scheduleFriday;
        this.scheduleSaturday = scheduleSaturday;
        this.scheduleSunday = scheduleSunday;
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
    toObject(): SpecialtyDocument {
        return SpecialtyMapper.fromDomainToDocument(this);
    }

    /**
     * Converts the Specialty entity to a plain object.
     * @returns {SpecialtyResponse} A plain object representation of the Specialty.
     */
    toResponse(): SpecialtyResponse {
        return SpecialtyMapper.fromDomainToResponse(this);
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
        return this.scheduleMonday;
    }

    /**
     * Sets the Monday schedule of the Specialty.
     * 
     * @param {string} scheduleMonday - The Monday schedule of the Specialty.
     */
    setScheduleMonday(scheduleMonday: string): void {
        this.scheduleMonday = scheduleMonday;
    }

    /**
     * Gets the Tuesday schedule of the Specialty.
     * @returns {string | undefined} The Tuesday schedule of the Specialty.
     */
    getScheduleTuesday(): string | undefined {
        return this.scheduleTuesday;
    }

    /**
     * Sets the Tuesday schedule of the Specialty.
     * 
     * @param {string} scheduleTuesday - The Tuesday schedule of the Specialty.
     */
    setScheduleTuesday(scheduleTuesday: string): void {
        this.scheduleTuesday = scheduleTuesday;
    }

    /**
     * Gets the Wednesday schedule of the Specialty.
     * @returns {string | undefined} The Wednesday schedule of the Specialty.
     */
    getScheduleWednesday(): string | undefined {
        return this.scheduleWednesday;
    }

    /**
     * Sets the Wednesday schedule of the Specialty.
     * 
     * @param {string} scheduleWednesday - The Wednesday schedule of the Specialty.
     */
    setScheduleWednesday(scheduleWednesday: string): void {
        this.scheduleWednesday = scheduleWednesday;
    }

    /**
     * Gets the Thursday schedule of the Specialty.
     * @returns {string | undefined} The Thursday schedule of the Specialty.
     */
    getScheduleThursday(): string | undefined {
        return this.scheduleThursday;
    }

    /**
     * Sets the Thursday schedule of the Specialty.
     * 
     * @param {string} scheduleThursday - The Thursday schedule of the Specialty.
     */
    setScheduleThurday(scheduleThursday: string): void {
        this.scheduleThursday = scheduleThursday;
    }

    /**
     * Gets the Friday schedule of the Specialty.
     * @returns {string | undefined} The Friday schedule of the Specialty.
     */
    getScheduleFriday(): string | undefined {
        return this.scheduleFriday;
    }

    /**
     * Sets the Friday schedule of the Specialty.
     * 
     * @param {string} scheduleFriday - The Friday schedule of the Specialty.
     */
    setScheduleFriday(scheduleFriday: string): void {
        this.scheduleFriday = scheduleFriday;
    }

    /**
     * Gets the Saturday schedule of the Specialty.
     * @returns {string | undefined} The Saturday schedule of the Specialty.
     */
    getScheduleSaturday(): string | undefined {
        return this.scheduleSaturday;
    }

    /**
     * Sets the Saturday schedule of the Specialty.
     * 
     * @param {string} scheduleSaturday - The Saturday schedule of the Specialty.
     */
    setScheduleSaturday(scheduleSaturday: string): void {
        this.scheduleSaturday = scheduleSaturday;
    }

    /**
     * Gets the Sunday schedule of the Specialty.
     * @returns {string | undefined} The Sunday schedule of the Specialty.
     */
    getScheduleSunday(): string | undefined {
        return this.scheduleSunday;
    }

    /**
     * Sets the Sunday schedule of the Specialty.
     * 
     * @param {string} scheduleSunday - The Sunday schedule of the Specialty.
     */
    setScheduleSunday(scheduleSunday: string): void {
        this.scheduleSunday = scheduleSunday;
    }

    /**
     * Converts the Specialty entity to a string.
     * @returns {string} A string representation of the IPS.
     */
    toString(): string {
        return JSON.stringify(this.toObject());
    }
}