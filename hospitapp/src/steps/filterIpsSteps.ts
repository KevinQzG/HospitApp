import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { driver } from "./commonSteps.ts";

When('the user clicks the "Buscar" button', async function () {
	const searchButton = await driver.wait(
		until.elementLocated(
			By.xpath(
				"/html/body/main/div/section[1]/div/div[2]/div[2]/div/form/button"
			)
		),
		15000,
		"Search button not found"
	);
	await driver.wait(
		until.elementIsVisible(searchButton),
		15000,
		"Search button not visible"
	);
	await driver.wait(
		until.elementIsEnabled(searchButton),
		15000,
		"Search button not enabled"
	);
	await driver.executeScript(
		"arguments[0].scrollIntoView(true);",
		searchButton
	);
    await driver.sleep(500);
	await searchButton.click();
	// Wait for filter page to load (assuming redirect to /ips or similar)
	await driver.wait(
		until.elementLocated(
			By.xpath("/html/body/main/div/div[2]/h1")
		),
		80000
	);
});

When(
	"the user selects the {string} specialism",
	async function (specialism: string) {
		const SPECIALISM_INPUT = await driver.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div[1]/div/form/div[1]/div[2]/div/div[1]/input"
				)
			),
			15000
		);
		await driver.wait(until.elementIsVisible(SPECIALISM_INPUT), 15000);
        await driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            SPECIALISM_INPUT
        );
        await SPECIALISM_INPUT.click();
        await driver.sleep(500);
        await SPECIALISM_INPUT.click();
		await SPECIALISM_INPUT.sendKeys(specialism);
        await driver.sleep(500);

		const option = await driver.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div[1]/div/form/div[1]/div[2]/div/div[2]/label/input"
				)
			),
			15000
		);
		await option.click();

		await driver.wait(
			until.elementLocated(
				By.xpath(`//span[contains(., "${specialism}")]`)
			),
			15000
		);
	}
);

When(
	"the user selects the {string} EPS",
	async function (eps: string) {
		const EPS_INPUT = await driver.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div[1]/div/form/div[1]/div[1]/div/div/input"
				)
			),
			15000
		);
		await driver.wait(until.elementIsVisible(EPS_INPUT), 15000);
        await driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            EPS_INPUT
        );
        await EPS_INPUT.click();
        await driver.sleep(500);
        await EPS_INPUT.click();
		await EPS_INPUT.sendKeys(eps);
        await driver.sleep(500);

		const option = await driver.wait(
			until.elementLocated(
				By.xpath(
					"/html/body/main/div/div[1]/div/form/div[1]/div[1]/div/div[2]/label/input"
				)
			),
			15000
		);
		await option.click();

		await driver.wait(
			until.elementLocated(
				By.xpath(`//span[contains(., "${eps}")]`)
			),
			15000
		);
	}
);

When('the user submits the "Buscar" button', async function () {
	const submitButton = await driver.wait(
		until.elementLocated(By.xpath("//button[contains(text(), 'Buscar')]")),
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

Then("the user should be redirected to the IPS list page with {string} specialism and {string} EPS selected", async function (specialism: string, eps: string) {
	await driver.wait(until.urlContains("/result"), 15000);
	expect(
		await driver.getCurrentUrl(),
		"Should be on IPS list page"
	).to.include("/result");
    await driver.sleep(10000);

	await driver.wait(
		until.elementLocated(
			By.xpath(`//span[contains(., "${specialism}")]`)
		),
		15000
	);
	const specialismElement = await driver.findElement(
		By.xpath(`//span[contains(., "${specialism}")]`)
	);
	const specialismText = await specialismElement.getText();
	expect(
		specialismText,
		"Selected specialism should be " + specialism
	).to.contain(specialism);

	await driver.wait(
		until.elementLocated(
			By.xpath(`//span[contains(., "${eps}")]`)
		),
		15000
	);

	const epsElement = await driver.findElement(
		By.xpath(`//span[contains(., "${eps}")]`)
	);
	const epsText = await epsElement.getText();
	expect(epsText, "Selected EPS should be " + eps).to.contain(eps);
});

Then(
	"the user should see the {string} IPS first in the List",
	async function (ips: string) {
		const firstIps = await driver.wait(
			until.elementLocated(
				By.xpath("/html/body/main/div/div[3]/div/a[1]/div/div[2]/h2")
			),
			15000
		);
		const ipsName = await firstIps.getText();
		expect(ipsName, "First IPS should be " + ips).to.equal(ips);
	}
);
