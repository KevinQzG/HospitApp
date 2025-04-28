import { SendEmailResponse } from "@/utils/helpers/sendEmail";

/**
 * @interface
 * @name EmailServiceAdapter
 * @description This interface should be implemented by the class that will manage the email service
 */
export default interface EmailServiceAdapter {
	/**
	 * Sends an email using the email service.
	 * @param {string} email - The email address of the recipient.
	 * @param {string} name - The name of the recipient.
	 * @param {string} message - The message to be sent.
	 * @param {string} subject - The subject of the email.
	 * @async
	 * @returns {Promise<SendEmailResponse>} The response of the email submission.
	 */
	send(
		email: string,
		name: string,
		message: string,
		subject: string
	): Promise<SendEmailResponse>;
}
