import { createSession, getSessionToken } from "@/utils/helpers/session";
import { create } from "domain";
import jwt from "jsonwebtoken";

// Mock process.env.JWT_SECRET_KEY
const JWT_SECRET = "test-secret-key"; // Mock secret for testing
process.env.JWT_SECRET_KEY = JWT_SECRET;

describe("Session Utilities", () => {
	let email: string;
	let token: string;
	let cookie: string;
	let decoded: { email: string; iat: number; exp: number };
	let result: { email: string; iat: number; exp: number } | null;
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console.log
		jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
	});

	afterEach(() => {
		jest.restoreAllMocks(); // Restore original console methods
	});

	describe("createSession", () => {
		it("should create a valid JWT session token with email", () => {
			email = "test@example.com";
			token = createSession(email);

			// Verify the token structure
			expect(token).toBeDefined();
			expect(typeof token).toBe("string");

			// Decode the token manually to check payload
			decoded = jwt.verify(token, JWT_SECRET) as {
				email: string;
				iat: number;
				exp: number;
			};
			expect(decoded.email).toBe(email);
			expect(decoded.exp).toBeGreaterThan(decoded.iat); // Ensure expiration is set
		});

		it("should log 'sending session' to console", () => {
			email = "test@example.com";
			const CONSOLE_SPY = jest.spyOn(console, "log");

			createSession(email);

			expect(CONSOLE_SPY).toHaveBeenCalledWith("sending session");
		});

		it("should throw an error if JWT_SECRET_KEY is not set", () => {
			// Temporarily unset the secret
			delete process.env.JWT_SECRET_KEY;

			email = "test@example.com";
			expect(() => createSession(email)).toThrow();

			// Restore for other tests
			process.env.JWT_SECRET_KEY = JWT_SECRET;
		});
	});

	describe("getSessionToken", () => {
		it("should return decoded token for a valid session cookie", () => {
			email = "test@example.com";
			token = createSession(email);
			cookie = `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`;

			result = getSessionToken(cookie);

			expect(result).not.toBeNull();
			expect(result?.email).toBe(email);
		});

		it("should return null for an invalid cookie format", () => {
			const INVALID_COOKIE = "invalid_cookie_string";

			result = getSessionToken(INVALID_COOKIE);

			expect(result).toBeNull();
		});

		it("should return null if no session token is present", () => {
			cookie = "other=value; Path=/";

			result = getSessionToken(cookie);

			expect(result).toBeNull();
		});

		it("should raise exception for an expired token", () => {
			email = "test@example.com";
			const EXPIRED_TOKEN = jwt.sign({ email }, JWT_SECRET, {
				expiresIn: "-1s",
			}); // Already expired
			cookie = `session=${EXPIRED_TOKEN}; Path=/`;

			expect(result).toBeNull();
			expect(() => getSessionToken(cookie)).toThrow(
				expect.objectContaining({
					name: "TokenExpiredError",
					message: expect.stringContaining("jwt expired"),
				})
			);
		});

		it("should return null for a tampered token", () => {
			email = "test@example.com";
			token = jwt.sign({ email }, JWT_SECRET, {
				expiresIn: "1h",
			});
			const INVALID_TOKEN = token.slice(0, -1) + "x"; // Corrupt the signature
			cookie = `session=${INVALID_TOKEN}; Path=/`;

			result = getSessionToken(cookie);

			expect(result).toBeNull();
			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining("Error verifying token:"),
				expect.any(Error)
			);
		});

		it("should return null if cookie is undefined or empty", () => {
			const resultEmpty = getSessionToken("");
			const resultUndefined = getSessionToken(undefined as any); // TypeScript workaround

			expect(resultEmpty).toBeNull();
			expect(resultUndefined).toBeNull();
		});
	});
});
