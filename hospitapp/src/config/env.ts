/**
 * Interface for client-side environment variables (always required).
 * @interface ClientEnvironmentVariables
 */
interface ClientEnvironmentVariables {
	NEXT_PUBLIC_API_URL: string;
	NEXT_PUBLIC_APP_NAME: string;
	NEXT_PUBLIC_MAPBOX_API_KEY: string;
}

/**
 * Interface for server-side environment variables (required only on the server).
 * @interface ServerEnvironmentVariables
 */
interface ServerEnvironmentVariables {
	DATABASE_URL: string;
	DATABASE_NAME: string;
	CACHE_TTL: number;
	JWT_SECRET_KEY: string;
	MAILERSEND_API_KEY: string;
	MAILERSEND_API_EMAIL: string;
	MAILERSEND_ADMIN_RECIPIENT_EMAIL1: string;
	MAILERSEND_ADMIN_RECIPIENT_NAME1: string;
	MAILERSEND_ADMIN_RECIPIENT_EMAIL2: string;
	MAILERSEND_ADMIN_RECIPIENT_NAME2: string;
}

/**
 * Combined environment variables type.
 * Client variables are always required; server variables are optional on the client.
 * @interface EnvironmentVariables
 */
type EnvironmentVariables = ClientEnvironmentVariables &
	Partial<ServerEnvironmentVariables>;

/**
 * Validates and retrieves environment variables.
 * Throws an error if any required environment variable is missing.
 * In the client, only validates variables with NEXT_PUBLIC_ prefix.
 * @function validateEnv
 * @returns {EnvironmentVariables} An object containing validated environment variables.
 * @throws {Error} If any required environment variable is missing.
 */
const validateEnv = (): EnvironmentVariables => {
	const isServer = typeof window === "undefined";

	// Initialize environment variables with defaults
	const ENV: EnvironmentVariables = {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
		NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "",
		NEXT_PUBLIC_MAPBOX_API_KEY:
			process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "",
		...(isServer && {
			DATABASE_URL: process.env.DATABASE_URL || "",
			DATABASE_NAME: process.env.DATABASE_NAME || "",
			CACHE_TTL: parseInt(process.env.CACHE_TTL || "86400", 10),
			JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",
			MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY || "",
			MAILERSEND_API_EMAIL: process.env.MAILERSEND_API_EMAIL || "",
			MAILERSEND_ADMIN_RECIPIENT_EMAIL1:
				process.env.MAILERSEND_ADMIN_RECIPIENT_EMAIL1 || "",
			MAILERSEND_ADMIN_RECIPIENT_NAME1:
				process.env.MAILERSEND_ADMIN_RECIPIENT_NAME1 || "",
			MAILERSEND_ADMIN_RECIPIENT_EMAIL2:
				process.env.MAILERSEND_ADMIN_RECIPIENT_EMAIL2 || "",
			MAILERSEND_ADMIN_RECIPIENT_NAME2:
				process.env.MAILERSEND_ADMIN_RECIPIENT_NAME2 || "",
		}),
	};

	// Define required variables
	const requiredVars = [
		"NEXT_PUBLIC_API_URL",
		"NEXT_PUBLIC_APP_NAME",
		"NEXT_PUBLIC_MAPBOX_API_KEY",
		...(isServer
			? [
					"DATABASE_URL",
					"DATABASE_NAME",
					"JWT_SECRET_KEY",
					"MAILERSEND_API_KEY",
					"MAILERSEND_API_EMAIL",
					"MAILERSEND_ADMIN_RECIPIENT_EMAIL1",
					"MAILERSEND_ADMIN_RECIPIENT_NAME1",
			  ]
			: []),
	];

	// Validate required variables
	for (const key of requiredVars) {
		if (!ENV[key as keyof EnvironmentVariables]) {
			throw new Error(`Missing environment variable: ${key}`);
		}
	}

	// Ensure CACHE_TTL is a valid number on the server
	if (isServer && (!ENV.CACHE_TTL || isNaN(ENV.CACHE_TTL))) {
		ENV.CACHE_TTL = 86400; // Default value
	}

	return ENV;
};

/**
 * Exports validated environment variables.
 * @constant ENV
 * @type {EnvironmentVariables}
 */
export const ENV = validateEnv();
