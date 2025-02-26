import { MongoClient, Db } from 'mongodb';
import { _ENV } from './env';

/**
 * MongoDB connection configuration.
 * @class MongoDB
 */
class MongoDB {
  private static client: MongoClient;
  private static db: Db;

  /**
   * Connects to the MongoDB database.
   * @static
   * @async
   * @returns {Promise<Db>} The database instance.
   * @throws {Error} If the connection fails.
   */
  static async connect(): Promise<Db> {
    if (this.db) {
      return this.db; // Return existing connection if available
    }

    try {
      // Create a new MongoDB client
      this.client = new MongoClient(_ENV.DATABASE_URL);

      // Connect to the database
      await this.client.connect();
      console.log('Connected to MongoDB');

      // Get the database instance
      this.db = this.client.db();
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Closes the MongoDB connection.
   * @static
   * @async
   */
  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}

export default MongoDB;