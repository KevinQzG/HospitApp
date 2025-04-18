import jwt, { TokenExpiredError } from 'jsonwebtoken';

/**
 * Creates a session token for the user.
 * @param {string} email - The user's email address.
 * @returns {string} - The session token.
 */
const createSession = (email: string): string => {
    const SESSION = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '1h',
    });
    return SESSION;

}

/**
 * Verifies the session token from the cookie.
 * @param {string} cookie - The cookie string from the request.
 * @returns {{ email: string; iat: number; exp: number } | null} - The decoded token if valid, null otherwise.
 */
const getSessionToken = (cookie: string): { email: string; iat: number; exp: number } | null => {
    try {
        const sessionToken = cookie?.split("session=")[1]?.split(";")[0];

        if (!sessionToken) {
            return null;
        }

        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET_KEY as string);
        return decoded as { email: string; iat: number; exp: number };
    } catch (error){
        if (error instanceof TokenExpiredError) {
            throw error;
        } else {
            console.error("Error verifying token:", error);
        }
        return null;
    }
}

const logOut = (document: { cookie: string; }) => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export { createSession, getSessionToken, logOut };

