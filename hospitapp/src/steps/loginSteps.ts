import { Given, When, Then, After } from "@cucumber/cucumber";
import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import { Options } from "selenium-webdriver/chrome";

let driver: any;

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
    By.xpath("//button[contains(text(), 'Iniciar Sesión')]")
  );
  await loginButton.click();
  await driver.wait(until.elementLocated(By.id("user-email")), 5000);
});

When(
  "the user enters valid credentials {string} and {string}",
  async function (email: string, password: string) {
    await driver.findElement(By.id("user-email")).sendKeys(email);
    await driver.findElement(By.id("user-password")).sendKeys(password);
  }
);

When(
  "the user enters invalid credentials {string} and {string}",
  async function (email: string, password: string) {
    await driver.findElement(By.id("user-email")).sendKeys(email);
    await driver.findElement(By.id("user-password")).sendKeys(password);
  }
);

When("the user submits the login form", async function () {
  await driver
    .findElement(By.xpath("//button[contains(text(), 'Iniciar Sesión')]"))
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
        By.xpath("//button[contains(text(), 'Cerrar Sesión')]")
      ),
      5000
    );
    expect(await logoutButton.isDisplayed()).to.be.true;
    const loginButtonExists = await driver
      .findElements(By.xpath("//button[contains(text(), 'Iniciar Sesión')]"))
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
      until.elementLocated(By.css(".error")),
      5000
    );
    const errorText = await errorMessage.getText();
    expect(errorText).to.equal("Credenciales incorrectas");
  }
);

After(async function () {
  if (driver) {
    await driver.quit();
  }
});
