import { execSync } from "child_process";

function runTests() {
  try {
    execSync(
      "npx cucumber-js src/features/**/*.feature --require-module ts-node/register --require src/steps/**/*.ts --format progress --format html:cucumber-report.html",
      { stdio: "inherit" }
    );
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

runTests();
