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
  private connectionPromise: Promise<Db> | null = null; // Track ongoing connection attempt

  /**
   * Connects to the MongoDB database with retry logic.
   * @async
   * @returns {Promise<Db>} The database instance.
   * @throws {Error} If the connection fails after retries.
   */
  async connect(): Promise<Db> {
    if (this.db && (await this.isConnected())) {
      return this.db;
    }

    // If already connecting, return the ongoing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.connectWithRetry()
      .then((db) => {
        this.db = db;
        this.connectionPromise = null; // Clear promise on success
        return db;
      })
      .catch((error) => {
        this.connectionPromise = null; // Clear promise on failure
        throw error;
      });

    return this.connectionPromise;
  }

  private async connectWithRetry(retries = 3, delayMs = 2000): Promise<Db> {
    try {
      // Runtime check to satisfy TypeScript
      if (!ENV.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
      }
      if (!ENV.DATABASE_NAME) {
        throw new Error("DATABASE_NAME is not defined");
      }

      this.client = new MongoClient(ENV.DATABASE_URL, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
      });

      await this.client.connect();
      console.log("Connected to MongoDB");

      this.db = this.client.db(ENV.DATABASE_NAME);

      // Handle connection events (v4+ compatible)
      this.client.on("serverHeartbeatFailed", (event) => {
        console.error("MongoDB heartbeat failed:", event);
        this.db = null; // Invalidate db reference
      });

      this.client.on("connectionPoolClosed", () => {
        console.log("MongoDB connection pool closed unexpectedly");
        this.db = null; // Invalidate db reference
      });

      return this.db;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      if (retries > 0) {
        console.log(`Retrying connection (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return this.connectWithRetry(retries - 1, delayMs * 2);
      }
      throw new Error(
        `MongoDB connection failed after retries: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
      this.connectionPromise = null;
      console.log("MongoDB connection closed");
    }
  }

  /**
   * Checks if the connection is healthy by pinging the server.
   * @returns {Promise<boolean>}
   */
  async isConnected(): Promise<boolean> {
    if (!this.client || !this.db) return false;
    try {
      await this.db.admin().ping();
      return true;
    } catch (error) {
      console.error("MongoDB ping failed:", error);
      return false;
    }
  }
}

export default MongoDB;