/**
 * Interface representing the required environment variables for the application.
 * @interface EnvironmentVariables
 * @property {string} NEXT_PUBLIC_API_URL - The base URL for the API (exposed to the client).
 * @property {string} DATABASE_URL - The connection string for the database (server-side only).
 * @property {string} APP_NAME - The name of the application.
 */
interface EnvironmentVariables {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_NAME: string;
  DATABASE_URL: string;
  DATABASE_NAME: string;
  CACHE_TTL: number;
}

/**
 * Validates and retrieves environment variables.
 * Throws an error if any required environment variable is missing.
 * @function validate_env
 * @returns {EnvironmentVariables} An object containing all validated environment variables.
 * @throws {Error} If any required environment variable is missing.
 */
const validateEnv = (): EnvironmentVariables => {
  const ENV = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '86400', 10)
  };

  // Check for missing required variables
  for (const [KEY, VALUE] of Object.entries(ENV)) {
    if (!VALUE) {
      throw new Error(`Missing environment variable: ${KEY}`);
    }
  }

  return ENV as EnvironmentVariables;
};

/**
 * Exports validated environment variables.
 * @constant _ENV
 * @type {EnvironmentVariables}
 */
export const ENV = validateEnv();
