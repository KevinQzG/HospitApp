import { MongoClient, Db } from "mongodb";
import DBAdapter from "@/adapters/db.adapter";
import { ENV } from "./env";
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
			this.client = new MongoClient(ENV.DATABASE_URL, {
				maxPoolSize: 10,
				minPoolSize: 2,
				serverSelectionTimeoutMS: 5000,
				connectTimeoutMS: 10000,
				socketTimeoutMS: 45000,
				heartbeatFrequencyMS: 10000,
			});

			// Connect to the database
			await this.client.connect();
			console.log("Connected to MongoDB");

			// Get the database instance
			this.db = this.client.db(ENV.DATABASE_NAME);
			return this.db;
		} catch (error) {
			console.error("Failed to connect to MongoDB:", error);
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
			console.log("MongoDB connection closed");
		}
	}
}

export default MongoDB;
