import { MongoClient, Db } from 'mongodb';
import DBAdapter from '@/adapters/db.adapter';
import { _ENV } from './env';
import { injectable } from "inversify";

/**
 * MongoDB connection configuration.
 * @class MongoDB
 */
@injectable()
class MongoDB implements DBAdapter<Db> {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  /**
   * Connects to the MongoDB database.
   * @async
   * @returns {Promise<Db>} The database instance.
   * @throws {Error} If the connection fails.
   */
  async connect(): Promise<Db> {
    if (this.client && this.db) {
      return this.db; // Return existing connection if available
    }

    try {
      // Create a new MongoDB client
      this.client = new MongoClient(_ENV.DATABASE_URL, {
        maxPoolSize: 5, // Optimal for serverless
        minPoolSize: 1,
        serverSelectionTimeoutMS: 3000
      });

      // Connect to the database
      await this.client.connect();
      console.log('Connected to MongoDB');

      // Get the database instance
      this.db = this.client.db(_ENV.DATABASE_NAME);
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Closes the MongoDB connection.
   * @async
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.db = null;
      this.client = null;
      console.log('MongoDB connection closed');
    }
  }

  get_client(): MongoClient | null {
    return this.client;
  }
}

export default MongoDB;