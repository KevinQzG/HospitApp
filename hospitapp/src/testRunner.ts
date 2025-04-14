const { Builder } = require('selenium-webdriver');
(async function test() {
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://example.com');
  console.log(await driver.getTitle());
  await driver.quit();
})();