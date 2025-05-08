import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { driver } from "./commonSteps.ts";

let user: string;
let ips: string;
let comment: string;
let date: string;

let updatedUser: string;
let updatedIps: string;
let updatedComment: string;
let updatedDate: string;

When("the user should select the first ips in the list", async function () {
	const firstIps = await driver.wait(
		until.elementLocated(
			By.xpath("/html/body/main/div/div[4]/div[1]/a[1]")
		),
		15000,
		"First IPS not found"
	);
	await driver.wait(
		until.elementIsVisible(firstIps),
		15000,
		"First IPS not visible"
	);
	await driver.wait(
		until.elementIsEnabled(firstIps),
		15000,
		"First IPS not enabled"
	);
	await driver.executeScript("arguments[0].scrollIntoView(true);", firstIps);
	await driver.sleep(500);
	await firstIps.click();
	await driver.sleep(10000);
});

When("the user clicks the add review button", async function () {
	const addReviewButton = await driver.wait(
		until.elementLocated(By.xpath("//button[contains(text(), 'Agregar Reseña')]")),
		15000,
		"Add Review button not found"
	);
	await driver.wait(
		until.elementIsVisible(addReviewButton),
		15000,
		"Add Review button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(addReviewButton),
		15000,
		"Add Review button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		addReviewButton
	);
	await driver.sleep(500);
	await addReviewButton.click();
});

When(
	"the user fills in the review form with {string} and a rating of 5 and submits the form",
	async function (comment: string) {
		const commentInput = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//textarea[contains(@id, 'newComments')]"
				)
			),
			30000,
			"Comment input not found"
		);
		await driver.wait(
			until.elementIsVisible(commentInput),
			15000,
			"Comment input not visible"
		);
		await driver.wait(
			until.elementIsEnabled(commentInput),
			15000,
			"Comment input not enabled"
		);
		await driver.executeScript(
			"arguments[0].scrollIntoView(true);",
			commentInput
		);
		await driver.sleep(500);
		await commentInput.sendKeys(comment);
		
		const ratingInput = await driver.wait(
			until.elementLocated(
				By.css("svg[aria-label='Calificar con 5 estrellas']")
			),
			15000,
			"Rating input not found"
		);
		await driver.wait(
			until.elementIsVisible(ratingInput),
			15000,
			"Rating input not visible"
		);
		await driver.wait(
			until.elementIsEnabled(ratingInput),
			15000,
			"Rating input not enabled"
		);
		await driver.executeScript(
			"arguments[0].scrollIntoView(true);",
			ratingInput
		);
		await driver.sleep(500);
		await ratingInput.click();

		const submitButton = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//button[contains(text(), 'Guardar')]"
				)
			),
			15000,
			"Submit button not found"
		);
		await driver.wait(
			until.elementIsVisible(submitButton),
			15000,
			"Submit button not visible"
		);
		await driver.wait(
			until.elementIsEnabled(submitButton),
			15000,
			"Submit button not enabled"
		);
		await driver.executeScript(
			"arguments[0].scrollIntoView(true);",
			submitButton
		);
		await driver.sleep(500);
		await submitButton.click();
	}
);

Then("the user should see a success message {string}", async function (message: string) {
	await driver.wait(
		until.elementLocated(
			By.xpath(
				"//div[contains(text(), '" + message + "')]"
			)
		),
		15000,
		"Success message not found"
	);
});

When('the admin clicks the "Editar Reviews" button', async function () {
	const editReviews = await driver.wait(
		until.elementLocated(By.xpath("/html/body/main/div/div/div[2]/div[2]")),
		15000,
		"Editar Reviews button not found"
	);
	await driver.wait(
		until.elementIsVisible(editReviews),
		15000,
		"Editar Reviews button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(editReviews),
		15000,
		"Editar Reviews button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		editReviews
	);
	await driver.sleep(500);
	await editReviews.click();
	// Wait for filter page to load (assuming redirect to /ips or similar)
	await driver.wait(
		until.elementLocated(By.xpath("//h1[contains(text(), 'Reseñas')]")),
		80000
	);
});

When(
	"the admin clicks on the trash icon of the first review",
	async function () {
		// Extract user, ips, comment and date from the review item
		user = await driver
			.wait(
				until.elementLocated(
					By.xpath(
						"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[1]/div"
					)
				),
				15000
			)
			.getText();
		ips = await driver
			.wait(
				until.elementLocated(
					By.xpath(
						"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[2]/div/span"
					)
				),
				15000
			)
			.getText();
		comment = await driver
			.wait(
				until.elementLocated(
					By.xpath(
						"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[4]"
					)
				),
				15000
			)
			.getText();
		date = await driver
			.wait(
				until.elementLocated(
					By.xpath(
						"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[5]"
					)
				),
				15000
			)
			.getText();

		const trashIcon = await driver.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[6]/button"
				)
			),
			15000
		);

		await driver.wait(
			until.elementIsVisible(trashIcon),
			15000,
			"Trash icon not visible"
		);
		await driver.wait(
			until.elementIsEnabled(trashIcon),
			15000,
			"Trash icon not enabled"
		);
		await driver.executeScript(
			"arguments[0].scrollIntoView(true);",
			trashIcon
		);
		await driver.sleep(500);
		await trashIcon.click();
	}
);

When("the admin confirms the deletion", async function () {
	const confirmPopUp = await driver.wait(
		until.elementLocated(
			By.xpath("//h2[contains(text(), '¿Eliminar esta reseña?')]")
		),
		15000
	);
	await driver.wait(until.elementIsVisible(confirmPopUp), 15000);
	const confirmButton = await driver.wait(
		until.elementLocated(
			By.xpath("//button[contains(text(), 'Eliminar')]")
		),
		15000
	);
	await driver.wait(
		until.elementIsVisible(confirmButton),
		15000,
		"Confirm button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(confirmButton),
		15000,
		"Confirm button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		confirmButton
	);
	await driver.sleep(500);
	await confirmButton.click();
	await driver.sleep(10000);
});

Then("the admin should see the updated list of reviews", async function () {
	// Get the updated user, ips, comment and date from the review item
	updatedUser = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[1]/div"
				)
			),
			15000
		)
		.getText();
	updatedIps = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[2]/div/span"
				)
			),
			15000
		)
		.getText();
	updatedComment = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[4]"
				)
			),
			15000
		)
		.getText();
	updatedDate = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div/div[2]/table/tbody/tr[1]/td[5]"
				)
			),
			15000
		)
		.getText();

	// Verify that at least one of the values is different
	const CONDITION =
		updatedUser !== user ||
		updatedIps !== ips ||
		updatedComment !== comment ||
		updatedDate !== date;
	expect(CONDITION, "The review was not deleted");
});
