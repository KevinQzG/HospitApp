import { Given, When, Then, After } from "@cucumber/cucumber";
import { Builder, By, WebDriver, until } from "selenium-webdriver";
import { expect } from "chai";
import { Options } from "selenium-webdriver/chrome.js";
import { setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(500000); // sets timeout to 30 seconds for all steps
let driver: WebDriver;

Given("the user has an account on the HospitApp platform", async function () {
	// Placeholder for account setup
});

Given("the user is on the HospitApp home page", async function () {
	const options = new Options();
	options.addArguments("--headless");
	options.addArguments("--no-sandbox");
	options.addArguments("--disable-dev-shm-usage");
	options.addArguments("--disable-gpu");

	driver = await new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options)
		.build();
	await driver.manage().window().setRect({ width: 1280, height: 720 }); // Set window size
	driver
		.manage()
		.setTimeouts({ implicit: 10000, pageLoad: 30000, script: 30000 });

	await driver.get("http://localhost:3000/");
	await driver.wait(async () => {
		const state = await driver.executeScript("return document.readyState");
		return state === "complete";
	}, 15000); // Wait for page to fully load
	const buscarButton = await driver.wait(
		until.elementLocated(By.xpath("//button[contains(text(), 'Buscar')]")),
		15000
	);
	expect(await buscarButton.isDisplayed());
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

After(async function () {
	if (driver) {
		await driver.quit();
	}
});
