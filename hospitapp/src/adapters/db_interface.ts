/**
 * @interface
 * @name DBInterface
 * @description Generic database interface for dependency inversion.
 */
export default interface DBInterface<T = object> {
    /**
     * Connects to the database and returns the database instance.
     * @returns {Promise<T>} The database instance.
     */
    connect(): Promise<T>;

    /**
     * Closes the database connection.
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
}
