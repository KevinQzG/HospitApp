import { injectable, inject } from "inversify";
import { SendEmailResponse } from "@/utils/helpers/sendEmail";
import { sendEmail } from "@/utils/helpers/sendEmail";
import EmailServiceAdapter from "@/adapters/services/sendEmail.service.adapter";

/**
 * @class
 * @name ReviewMongoService
 * @description This class contains the logic to interact with the review collection in the database.
 */
@injectable()
export class EmailMailerSendService implements EmailServiceAdapter {
	/**
	 * @constructor
	 * @returns {void}
	 * @description Creates an instance of the EmailMailerSendService class.
	 */
	constructor() {}

	async send(
		email: string,
		name: string,
		message: string,
		subject: string
	): Promise<SendEmailResponse> {
		return await sendEmail(message, email, name, subject);
	}

}
