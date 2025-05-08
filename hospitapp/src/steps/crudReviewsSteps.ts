import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { driver } from "./commonSteps.ts";

When("the user clicks the {string} IPS", async function (ips: string) {
	// Write code here that turns the phrase above into concrete actions
	const IPS = await driver.wait(
		until.elementLocated(By.xpath("//h2[contains(text(), '" + ips + "')]")),
		15000,
		"First IPS not found"
	);

	await driver.wait(
		until.elementIsVisible(IPS),
		15000,
		"First IPS not visible"
	);
	await driver.wait(
		until.elementIsEnabled(IPS),
		15000,
		"First IPS not enabled"
	);
	await driver.executeScript("arguments[0].scrollIntoView(true);", IPS);
	await driver.sleep(500);
	await IPS.click();
});

Then("the user should be redirected to the IPS detail page", async function () {
	// Write code here that turns the phrase above into concrete actions
	await driver.wait(
		until.elementLocated(By.xpath("//h2[contains(text(), 'Cómo llegar')]")),
		50000,
		"First IPS not found"
	);
});

When("the user clicks the edit review button", async function () {
	// Write code here that turns the phrase above into concrete actions
	const editReviewButton = await driver.wait(
		until.elementLocated(
			By.css("button:has(svg.lucide-pencil)")
		),
		15000,
		"Edit Review button not found"
	);
	await driver.wait(
		until.elementIsVisible(editReviewButton),
		15000,
		"Edit Review button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(editReviewButton),
		15000,
		"Edit Review button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		editReviewButton
	);
	await driver.sleep(500);
	await editReviewButton.click();
});

When(
	"changes the review text to {string} and submits the form",
	async function (editedComment: string) {
		const commentInput = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//textarea[contains(@id, 'editComments')]"
				)
			),
			15000,
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
		// Clear the input field
		await commentInput.clear();
		await driver.sleep(500);
		// Fill the input field with the new comment
		await commentInput.sendKeys(editedComment);

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

When('the user clicks the delete review button', async function () {
	const deleteReviewButton = await driver.wait(
		until.elementLocated(
			By.css("button:has(svg.lucide-trash2)")
		),
		30000,
		"Delete Review button not found"
	);
	await driver.wait(
		until.elementIsVisible(deleteReviewButton),
		15000,
		"Delete Review button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(deleteReviewButton),
		15000,
		"Delete Review button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		deleteReviewButton
	);
	await driver.sleep(500);
	await deleteReviewButton.click();
  });
