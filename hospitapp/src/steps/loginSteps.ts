import { Given, When, Then, After } from "@cucumber/cucumber";
import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import { Options } from "selenium-webdriver/chrome.js";

let driver: any;

Given("the user has an account on the HospitApp platform", async function () {
	// Placeholder for account setup
});

Given("the user is on the HospitApp home page", async function () {
	const options = new Options();

	driver = await new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options)
		.build();
	await driver.get("https://hospitapp.vercel.app/");

	const buscarButton = await driver.wait(
		until.elementLocated(By.xpath("//button[contains(text(), 'Buscar')]")),
		5000
	);
	expect(await buscarButton.isDisplayed()).to.be.true;
});

When('the user clicks the "Iniciar Sesión" button', async function () {
	const loginButton = await driver.findElement(
		By.xpath("/html/body/header/div/nav/a[3]")
	);
	await loginButton.click();
	await driver.wait(
		until.elementLocated(
			By.xpath("/html/body/main/section/div[2]/div/form/div[1]/label")
		),
		5000
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
	await driver
		.findElement(By.xpath("/html/body/main/section/div[2]/div/form/button"))
		.click();
});

Then("the user should be redirected to the home page", async function () {
	await driver.wait(until.urlIs("https://hospitapp.vercel.app/"), 5000);
	expect(await driver.getCurrentUrl()).to.equal(
		"https://hospitapp.vercel.app/"
	);
});

Then(
	'the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"',
	async function () {
		const logoutButton = await driver.wait(
			until.elementLocated(
				By.xpath("/html/body/header/div/nav/button")
			),
			5000
		);
		expect(await logoutButton.isDisplayed()).to.be.true;
		const loginButtonExists = await driver
			.findElements(
				By.xpath("/html/body/header/div/nav/a[3]")
			)
			.then((elements: any[]) => elements.length > 0);
		expect(loginButtonExists).to.be.false;
	}
);

Then("a user session should be created", async function () {
	const cookies = await driver.manage().getCookies();
	const sessionCookie = cookies.find((cookie: any) =>
		cookie.name.includes("session")
	);
	expect(sessionCookie, "Session cookie not found").to.exist;
});

Then(
	'the user should see an error message "Credenciales incorrectas"',
	async function () {
		const errorMessage = await driver.wait(
			until.elementLocated(By.xpath("/html/body/main/section/div[2]/div/form/div[1]/span")),
			5000
		);
		const errorText = await errorMessage.getText();
		expect(errorText).to.equal("Correo electrónico o contraseña incorrectos");
	}
);

After(async function () {
	if (driver) {
		await driver.quit();
	}
});
