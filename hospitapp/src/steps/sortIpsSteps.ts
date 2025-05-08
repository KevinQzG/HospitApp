import { When } from "@cucumber/cucumber";
import { By, until } from "selenium-webdriver";
import { driver } from "./commonSteps.ts";

When('the user clicks the "Agregar Filtro" button', async function () {
	const ADD_SORT_BUTTON = await driver.wait(
		until.elementLocated(By.xpath("/html/body/main/div/div[3]/div/div[1]/button")),
		15000
	);
	await driver.wait(until.elementIsVisible(ADD_SORT_BUTTON), 15000);
	await driver.wait(until.elementIsEnabled(ADD_SORT_BUTTON), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		ADD_SORT_BUTTON
	);
    await driver.sleep(500);
	await ADD_SORT_BUTTON.click();
});

When('the user selects the {string} filter in DESCENDING order', async function (sort: string) {
	const SORT_ELEMENT = await driver.wait(
		until.elementLocated(By.xpath("/html/body/main/div/div[3]/div/div[1]/div/select")),
		15000
	);
	await driver.wait(until.elementIsVisible(SORT_ELEMENT), 15000);
	await driver.wait(until.elementIsEnabled(SORT_ELEMENT), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		SORT_ELEMENT
	);
    await driver.sleep(500);
	await SORT_ELEMENT.click();

	const SELECT_OPTION = await driver.wait(
		until.elementLocated(By.xpath(`//option[contains(text(), "${sort}")]`)),
		15000
	);
	await driver.wait(until.elementIsVisible(SELECT_OPTION), 15000);
	await driver.wait(until.elementIsEnabled(SELECT_OPTION), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		SELECT_OPTION
	);
    await driver.sleep(500);
	await SELECT_OPTION.click();

	const DESC_BUTTON = await driver.wait(
		until.elementLocated(By.xpath(`/html/body/main/div/div[3]/div/div[1]/div/div/button[2]`)),
		15000
	);
	await driver.wait(until.elementIsVisible(DESC_BUTTON), 15000);
	await driver.wait(until.elementIsEnabled(DESC_BUTTON), 15000);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		DESC_BUTTON
	);
    await driver.sleep(500);
	await DESC_BUTTON.click();
	await driver.sleep(10000);
});