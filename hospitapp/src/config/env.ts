/**
 * Interface representing the required environment variables for the application.
 * @interface EnvironmentVariables
 * @property {string} NEXT_PUBLIC_API_URL - The base URL for the API (exposed to the client).
 * @property {string} NEXT_PUBLIC_APP_NAME - The name of the application (exposed to the client).
 * @property {string} DATABASE_URL - The connection string for the database (server-side only).
 * @property {string} DATABASE_NAME - The name of the database (server-side only).
 * @property {number} CACHE_TTL - The cache time-to-live in seconds (server-side only).
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
  * In the client, only validates variables with NEXT_PUBLIC_ prefix.
  * @function validateEnv
  * @returns {Partial<EnvironmentVariables>} An object containing validated environment variables.
  * @throws {Error} If any required environment variable is missing.
  */
 const validateEnv = (): Partial<EnvironmentVariables> => {
	const isServer = typeof window === "undefined";
 
	// Definir todas las variables de entorno
	const ENV = {
	  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
	  // Incluir variables del servidor solo si estamos en el servidor
	  ...(isServer && {
		 DATABASE_URL: process.env.DATABASE_URL,
		 DATABASE_NAME: process.env.DATABASE_NAME,
		 CACHE_TTL: parseInt(process.env.CACHE_TTL || "86400", 10),
	  }),
	};
 
	// Validar variables
	for (const [key, value] of Object.entries(ENV)) {
	  // En el cliente, solo validar variables públicas
	  if (!isServer && !key.startsWith("NEXT_PUBLIC_")) {
		 continue;
	  }
	  if (!value) {
		 throw new Error(`Missing environment variable: ${key}`);
	  }
	}
 
	return ENV as Partial<EnvironmentVariables>;
 };
 
 /**
  * Exports validated environment variables.
  * @constant ENV
  * @type {Partial<EnvironmentVariables>}
  */
 export const ENV = validateEnv();