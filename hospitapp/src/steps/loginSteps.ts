import { Given, When, Then, After } from "@cucumber/cucumber";
import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import chrome from "selenium-webdriver/chrome";
import { ServiceBuilder } from "selenium-webdriver/chrome";

let driver: any;

Given("the user is on the HospitApp home page", async function () {
  const options = new chrome.Options();
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  await driver.get("https://hospitapp.vercel.app/");

  // Verify "Buscar" button exists (Step 1)
  const buscarButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Buscar')]")),
    5000
  );
  expect(await buscarButton.isDisplayed()).to.be.true;
});

When('the user clicks the "Iniciar Sesión" button', async function () {
  const loginButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Iniciar Sesión')]")
  );
  await loginButton.click();

  // Verify redirection to login page (Step 2)
  await driver.wait(
    until.elementLocated(By.id("email")), // Adjust ID based on actual login page
    5000
  );
});

When(
  "the user enters valid credentials {string} and {string}",
  async function (email: string, password: string) {
    await driver.findElement(By.id("email")).sendKeys(email); // Adjust ID
    await driver.findElement(By.id("password")).sendKeys(password); // Adjust ID
  }
);

When(
  "the user enters invalid credentials {string} and {string}",
  async function (email: string, password: string) {
    await driver.findElement(By.id("email")).sendKeys(email); // Adjust ID
    await driver.findElement(By.id("password")).sendKeys(password); // Adjust ID
  }
);

When("the user submits the login form", async function () {
  await driver.findElement(By.xpath("//button[contains(text(), 'Iniciar Sesión')]")).click(); // Adjust selector
});

Then("the user should be redirected to the home page", async function () {
  await driver.wait(until.urlIs("https://hospitapp.vercel.app/"), 5000);
  expect(await driver.getCurrentUrl()).to.equal("https://hospitapp.vercel.app/");
});

Then('the "Iniciar Sesión" button should be replaced by "Cerrar Sesión"', async function () {
  const logoutButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Cerrar Sesión')]")),
    5000
  );
  expect(await logoutButton.isDisplayed()).to.be.true;

  // Verify "Iniciar Sesión" is not present
  const loginButtonExists = await driver
    .findElements(By.xpath("//button[contains(text(), 'Iniciar Sesión')]"))
    .then((elements: any[]) => elements.length > 0);
  expect(loginButtonExists).to.be.false;
});

Then("a user session should be created", async function () {
  // Check for session cookie or local storage (adjust based on your app’s session mechanism)
  const cookies = await driver.manage().getCookies();
  const sessionCookie = cookies.find((cookie: any) => cookie.name === "session"); // Adjust cookie name
  expect(sessionCookie).to.exist;

  // Alternatively, check local storage via JavaScript
  const sessionStorage = await driver.executeScript("return window.localStorage.getItem('session');"); // Adjust key
  expect(sessionStorage).to.not.be.null;
});

Then('the user should see an error message "Credenciales incorrectas"', async function () {
  const errorMessage = await driver.wait(
    until.elementLocated(By.id("error-message")), // Adjust ID
    5000
  );
  const errorText = await errorMessage.getText();
  expect(errorText).to.equal("Credenciales incorrectas");
});

After(async function () {
  if (driver) {
    await driver.quit();
  }
});