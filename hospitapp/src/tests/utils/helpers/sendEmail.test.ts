import { sendEmail } from "@/utils/helpers/sendEmail";
import { MailerSend } from "mailersend";


// Mock MailerSend SDK
jest.mock("mailersend", () => ({
	MailerSend: jest.fn().mockImplementation(() => ({
		email: {
			send: jest
				.fn()
				.mockResolvedValue({ statusCode: 202, message: "Email sent" }),
		},
	})),
	EmailParams: jest.fn().mockImplementation(() => ({
		setFrom: jest.fn().mockReturnThis(),
		setTo: jest.fn().mockReturnThis(),
		setReplyTo: jest.fn().mockReturnThis(),
		setSubject: jest.fn().mockReturnThis(),
		setHtml: jest.fn().mockReturnThis(),
		setText: jest.fn().mockReturnThis(),
		setCc: jest.fn().mockReturnThis(),
	})),
	Sender: jest.fn(),
	Recipient: jest.fn(),
}));

describe("sendEmail", () => {
	let message: string;
	let email: string;
	let name: string;
	let subject: string;

	beforeEach(() => {
		message = "Test message";
		email = "pipaso903@gmail.com";
		name = "Juan Felipe Restrepo Buitrago";
		subject = "Test Subject";

		process.env.MAILERSEND_API_KEY = "mock-api-key";
		process.env.MAILERSEND_API_EMAIL =
			"email@example.com";
		process.env.MAILERSEND_ADMIN_RECIPIENT_EMAIL1 =
			"jfrestrepb@eafit.edu.co";
		process.env.MAILERSEND_ADMIN_RECIPIENT_NAME1 = "Juan Felipe";
	});

	afterEach(() => {
		jest.clearAllMocks();

		delete process.env.MAILERSEND_API_KEY;
		delete process.env.MAILERSEND_API_EMAIL;
		delete process.env.MAILERSEND_ADMIN_RECIPIENT_EMAIL1;
		delete process.env.MAILERSEND_ADMIN_RECIPIENT_NAME1;
		delete process.env.MAILERSEND_ADMIN_RECIPIENT_EMAIL2;
		delete process.env.MAILERSEND_ADMIN_RECIPIENT_NAME2;
	});

	it("should send an email successfully", async () => {
		const RESPONSE = await sendEmail(message, email, name, subject);
		expect(RESPONSE.status).toBe(true);
		expect(RESPONSE.message).toBe("¡Correo Enviado Exitosamente!");
		expect(RESPONSE.response).toBe("{\"statusCode\":202,\"message\":\"Email sent\"}");
	});
	it("should return an error if sending fails", async () => {
		(MailerSend as jest.Mock).mockImplementation(() => ({
			email: {
				send: jest.fn().mockRejectedValue(new Error("Test error")),
			},
		}));

		const RESPONSE = await sendEmail(message, email, name, subject);
		expect(RESPONSE.status).toBe(false);
		expect(RESPONSE.message).toBe("Error enviando el correo");
		expect(RESPONSE.response).toBe("Test error");
	});
	it("should throw an error if email is not provided", async () => {
		const RESPONSE = await sendEmail(message, "", name, subject);
		expect(RESPONSE.status).toBe(false);
		expect(RESPONSE.message).toBe("Error enviando el correo");
		expect(RESPONSE.response).toBe("All parameters are required");
	});
});
