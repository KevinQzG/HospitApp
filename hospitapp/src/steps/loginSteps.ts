import { Given, When, Then, After } from "@cucumber/cucumber";
import { By, until } from "selenium-webdriver";
import { expect } from "chai";
import { driver } from "./commonSteps.ts";

Given("the user has an account on the HospitApp platform", async function () {
	// Placeholder for account setup
});

When('the user clicks the "Iniciar Sesión" button', async function () {
	const loginButton = await driver.wait(
		until.elementLocated(By.xpath("/html/body/header/div/nav/a[3]")),
		15000
	);
	await driver.wait(until.elementIsVisible(loginButton), 15000);
	await driver.wait(until.elementIsEnabled(loginButton), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		loginButton
	);
	await loginButton.click();
	await driver.wait(
		until.elementLocated(
			By.xpath("/html/body/main/section/div[2]/div/form/div[1]/label")
		),
		30000
	);
});

When(
	"the user enters valid credentials {string} and {string}",
	async function (email: string, password: string) {
		await driver
			.findElement(
				By.xpath("/html/body/main/section/div[2]/div/form/div[1]/input")
			)
			.sendKeys(email);
		await driver
			.findElement(
				By.xpath(
					"/html/body/main/section/div[2]/div/form/div[2]/div/input"
				)
			)
			.sendKeys(password);
	}
);

When(
	"the user enters invalid credentials {string} and {string}",
	async function (email: string, password: string) {
		await driver
			.findElement(
				By.xpath("/html/body/main/section/div[2]/div/form/div[1]/input")
			)
			.sendKeys(email);
		await driver
			.findElement(
				By.xpath(
					"/html/body/main/section/div[2]/div/form/div[2]/div/input"
				)
			)
			.sendKeys(password);
	}
);

When("the user submits the login form", async function () {
	const submitButton = await driver.wait(
		until.elementLocated(
			By.xpath("/html/body/main/section/div[2]/div/form/button")
		),
		15000
	);
	await driver.wait(until.elementIsVisible(submitButton), 15000);
	await driver.wait(until.elementIsEnabled(submitButton), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		submitButton
	);
	await driver.sleep(500);
	await submitButton.click();
});

Then("the user should be redirected to the home page", async function () {
	await driver.wait(until.urlIs("http://localhost:3000/"), 30000);
	expect(await driver.getCurrentUrl()).to.equal("http://localhost:3000/");
});

Then("a user session should be created", async function () {
	const cookies = await driver.manage().getCookies();
	const sessionCookie = cookies.find((cookie) =>
		cookie.name.includes("session")
	);
	expect(sessionCookie, "Session cookie not found");
});

Then(
	'the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"',
	async function () {
		const logoutButton = await driver.wait(
			until.elementLocated(By.xpath("/html/body/header/div/nav/button")),
			5000
		);
		expect(await logoutButton.isDisplayed());
		const loginButtonElements = await driver.findElements(
			By.xpath("/html/body/header/div/nav/a[3]")
		);
		expect(
			loginButtonElements.length,
			"Login button should not exist"
		).to.equal(0);
	}
);



Then(
	'the user should see an error message "Credenciales incorrectas"',
	async function () {
		await driver.wait(
			until.elementLocated(
				By.xpath(
					"//span[contains(text(), 'Correo electrónico o contraseña incorrectos')]"
				)
			),
			5000
		);
	}
);
