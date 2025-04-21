const { spawn } = require("child_process");
const path = require("path");

// Start Next.js dev server
const dev = spawn("npm", ["run", "dev"], {
    cwd: path.resolve(__dirname),
    stdio: "inherit",
    shell: true,
});

// Wait for server and run tests
const test = spawn(
    "npx",
    ["wait-on", "http://localhost:3000", "&&", "npm", "run", "test:functional"],
    {
        cwd: path.resolve(__dirname),
        stdio: "inherit",
        shell: true,
    }
);

// When tests finish, kill dev server and exit with test exit code
test.on("exit", (code) => {
    dev.kill("SIGTERM");
    process.exit(code);
});

// Handle errors
test.on("error", (err) => {
    console.error("Test process error:", err);
    dev.kill("SIGTERM");
    process.exit(1);
});

dev.on("error", (err) => {
    console.error("Dev server error:", err);
    test.kill("SIGTERM");
    process.exit(1);
});