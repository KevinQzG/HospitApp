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
}

/**
 * Validates and retrieves environment variables.
 * Throws an error if any required environment variable is missing.
 * @function validate_env
 * @returns {EnvironmentVariables} An object containing all validated environment variables.
 * @throws {Error} If any required environment variable is missing.
 */
const validate_env = (): EnvironmentVariables => {
  const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  // Check for missing required variables
  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as EnvironmentVariables;
};

/**
 * Exports validated environment variables.
 * @constant _ENV
 * @type {EnvironmentVariables}
 */
export const _ENV = validate_env();
