import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { ENV } from "@/config/env";

interface SendEmailResponse {
	status: boolean;
	message: string;
	response: any;
}

async function sendEmail(
	message: string,
	email: string,
	name: string,
	subject: string
): Promise<SendEmailResponse> {
	try {
		const requiredEnvVars = {
			MAILERSEND_API_KEY: ENV.MAILERSEND_API_KEY,
			MAILERSEND_API_EMAIL: ENV.MAILERSEND_API_EMAIL,
			MAILERSEND_ADMIN_RECIPIENT_EMAIL1:
				ENV.MAILERSEND_ADMIN_RECIPIENT_EMAIL1,
			MAILERSEND_ADMIN_RECIPIENT_NAME1:
				ENV.MAILERSEND_ADMIN_RECIPIENT_NAME1,
		};

		const missingVars = Object.entries(requiredEnvVars)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingVars.length > 0) {
			const errorMessage = `Missing environment variables: ${missingVars.join(
				", "
			)}`;
			return {
				status: false,
				message: "Error enviando el email",
				response: errorMessage,
			};
		}

    if (!message || !email || !name || !subject) {
      return {
        status: false,
        message: "Error enviando el email",
        response: "All parameters are required",
      };
    }

		const mailerSend = new MailerSend({
			apiKey:
				ENV.MAILERSEND_API_KEY ||
				(() => {
					throw new Error("MAILERSEND_API_KEY is not defined");
				})(),
		});

		const sentFrom = new Sender(
			ENV.MAILERSEND_API_EMAIL ||
				(() => {
					throw new Error("MAILERSEND_API_EMAIL is not defined");
				})(),
			name
		);

		const recipients = [
			new Recipient(
				ENV.MAILERSEND_ADMIN_RECIPIENT_EMAIL1 ||
          (() => {
            throw new Error("MAILERSEND_ADMIN_RECIPIENT_EMAIL1 is not defined");
          }
        )(),
				ENV.MAILERSEND_ADMIN_RECIPIENT_NAME1
			),
		];

    let ccParameter: Recipient[] = [];
		if (
			ENV.MAILERSEND_ADMIN_RECIPIENT_EMAIL2 &&
			ENV.MAILERSEND_ADMIN_RECIPIENT_NAME2
		) {
			ccParameter.push(
        new Recipient(
					ENV.MAILERSEND_ADMIN_RECIPIENT_EMAIL2,
					ENV.MAILERSEND_ADMIN_RECIPIENT_NAME2
				)
      )
		}

		const recipientReplyto = new Recipient(email, name);

		const emailParams = new EmailParams()
			.setFrom(sentFrom)
      .setCc(ccParameter)
			.setTo(recipients)
			.setReplyTo(recipientReplyto)
			.setSubject(subject)
			.setHtml(
				`
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
			)
			.setText(`${subject}, from ${name} (${email}): ${message}`);

		const response = await mailerSend.email.send(emailParams);

		return {
			status: true,
			message: "¡Email Enviado Exitosamente!",
			response: JSON.stringify(response),
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: false,
				message: "Error enviando el email",
				response: error.message,
			};
		} else {
			// Handle non-Error exceptions
      try {
        return {
          status: false,
          message: "Error enviando el email",
          response: "Unknown error: " + JSON.stringify(error)
        };
        
      } catch {
        return {
          status: false,
          message: "Error enviando el email",
          response: "Unknown error: " + String(error)
        };
      }
			
		}
	}
}

export { sendEmail };
