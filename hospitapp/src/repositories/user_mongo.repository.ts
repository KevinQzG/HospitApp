import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import UserRepositoryAdapter from "@/adapters/user_repository.adapter";
import { _TYPES } from "@/adapters/types";
import { UserDocument } from "@/models/user.interface";
import { User } from "@/models/user";
import type DBAdapter from "@/adapters/db.adapter";
import { UserMapper  } from "@/utils/mappers/user_mapper";


/**
 * @class
 * @name UserRepository
 * @description This class allows me to interact with the User collection in the database.
 */

@injectable()
export class UserMongoRepository implements UserRepositoryAdapter {
    /**
     * @constructor
     * @param {DBAdapter} db_handler - The database handler.
     * @returns {void}
     * @description Creates an instance of the UserRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(_TYPES.DBAdapter) private db_handler: DBAdapter<Db>
    ) { }
    create_user(email: string, password: string, name: string, address: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findUserByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const db = await this.db_handler.connect();
    
            // Buscar usuarios cuyo email contenga el valor proporcionado
            const userDoc = await db.collection<UserDocument>("USERS").findOne({
                email: { $regex: email, $options: "i" } // Búsqueda insensible a mayúsculas
            });
    
            return userDoc ? UserMapper.from_document_to_domain(userDoc) : null;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Database error");
        }
    }
    
    async createUser(username: string, email: string, password: string, role: string): Promise<void> {
        try {
            const db = await this.db_handler.connect();
    
            const userDoc: UserDocument = {
                _id: new ObjectId(),
                username,
                email,
                password, 
                role: "USER",
            };
    
            await db.collection<UserDocument>("USERS").insertOne(userDoc);
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Database error");
        }
    }
    
}
