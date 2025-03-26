import { ObjectId } from "mongodb";
import { UserDocument, UserResponse } from "@/models/user.interface";
import { User } from "@/models/user";

/**
 * Class that allows to map User entities from domain to document and vice versa.
 * @class USERMapper
 */


export class UserMapper {
     /**
     * Maps an User document to an User entity.
     * @param {UserDocument} raw - The USER document.
     * @returns {User} The USER entity.
     */

    static fromDocumentToDomain(raw: UserDocument): User {
        return new User(
            raw._id,
            raw.email,
            raw.password,
            raw.role,
            raw.phone,
            raw.eps
        );
    }
    
    /**
     * Maps an User entity to an User document.
     * @param {User} user - The User entity.
     * @returns {UserDocument} The User document.
     */


    static fromDomainToDocument(user: User): UserDocument {
        return {
            _id: user.getId(),
            phone: user.getPhone(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            eps: user.getEps()
        };
    }

    /**
     * Maps an User response to an User entity.
     * @param {UserResponse} raw - The User response.
     * @returns {User} The User entity.
     */
    static fromResponseToDomain(raw: UserResponse): User {
        return new User(
            new ObjectId(raw._id),
            raw.phone,
            raw.email,
            raw.password,
            raw.role,
            raw.eps
        );
    }

    /**
     * Maps an User entity to an User response.
     * @param {User} user - The User entity.
     * @returns {UserResponse} The User response.
     */
    static fromDomainToResponse(user: User): UserResponse {
        return {
            _id: user.getId().toHexString(),
            phone: user.getPhone(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            eps: user.getEps()
        };
    }
}
