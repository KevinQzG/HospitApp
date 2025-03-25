import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import UserRepositoryAdapter from "@/adapters/user_repository.adapter";
import { TYPES } from "@/adapters/types";
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
        @inject(TYPES.DBAdapter) private db_handler: DBAdapter<Db>
    ) { }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const db = await this.db_handler.connect();
    
            const _USER_DOC = await db.collection<UserDocument>("USERS").findOne({
                email: { $regex: email, $options: "i" }
            });
            console.log(_USER_DOC);
            

            return _USER_DOC? UserMapper.fromDocumentToDomain(_USER_DOC) : null;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Database error");
        }
    }
    
    async createUser(eps: string, email: string, password: string, role: string, phone: string): Promise<boolean> {
        try {
            const db = await this.db_handler.connect();
    
            const userDoc: UserDocument = {
                _id: new ObjectId(),
                eps,
                email,
                password, 
                phone,
                role: "USER",
            };
    
            await db.collection<UserDocument>("USERS").insertOne(userDoc);
    
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
    }
    
}
