import { Given, After, Before } from "@cucumber/cucumber";
import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import { expect } from "chai";
import { setDefaultTimeout } from "@cucumber/cucumber";


setDefaultTimeout(5000000); // sets timeout to 5000000ms (5000s)
let driver: WebDriver;

Before(async function () {
    const options = new Options();
    // Deny geolocation
    options.setUserPreferences({
        "profile.default_content_setting_values.geolocation": 2,
    });
    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    await driver.manage().window().setRect({ width: 1280, height: 720 });
    driver
        .manage()
        .setTimeouts({ implicit: 10000, pageLoad: 30000, script: 30000 });
});

Given("the user is on the HospitApp home page", async function () {
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

Given("the admin is on the HospitApp admin page", async function () {
	await driver.get("http://localhost:3000/admin");
	await driver.wait(async () => {
		const state = await driver.executeScript("return document.readyState");
		return state === "complete";
	}, 15000); // Wait for page to fully load
	const adminTitle = await driver.wait(
		until.elementLocated(By.xpath("//h1[contains(text(), 'Panel de Administración')]")),
		15000
	);
	expect(await adminTitle.isDisplayed());
});


After(async function () {
	if (driver) {
		await driver.quit();
	}
});

export { driver };