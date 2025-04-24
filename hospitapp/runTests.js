const { spawn } = require("child_process");
const path = require("path");
const treeKill = require("tree-kill");

// Start Next.js dev server
const dev = spawn("npm", ["run", "dev"], {
    cwd: path.resolve(__dirname),
    stdio: ["inherit", "inherit", "pipe"], // Capture stderr separately
    shell: true,
});

// Buffer for dev server stderr
let devStderr = "";
dev.stderr.on("data", (data) => {
    devStderr += data.toString();
    console.error("Dev server stderr:", data.toString());
});

// Wait for server and run tests
const test = spawn(
    "npx",
    [
        "wait-on",
        "http://localhost:3000",
        "--timeout",
        "60000", // 60s timeout
        "&&",
        "npm",
        "run",
        "test:functional",
    ],
    {
        cwd: path.resolve(__dirname),
        stdio: "inherit",
        shell: true,
    }
);

// When tests finish, kill dev server and exit with test exit code
test.on("exit", (code) => {
    console.log("Tests finished with code:", code);
    treeKill(dev.pid, "SIGTERM", (err) => {
        if (err) {
            console.error("Failed to kill dev server:", err);
            process.exit(1);
        }
        console.log("Dev server terminated");
        process.exit(code || 0);
    });
});

// Handle test errors
test.on("error", (err) => {
    console.error("Test process error:", err);
    treeKill(dev.pid, "SIGTERM", (err) => {
        if (err) {
            console.error("Failed to kill dev server:", err);
        }
        process.exit(1);
    });
});

// Handle dev server errors
dev.on("error", (err) => {
    console.error("Dev server error:", err);
    console.error("Dev server stderr output:", devStderr);
    treeKill(test.pid, "SIGTERM", (err) => {
        if (err) {
            console.error("Failed to kill test process:", err);
        }
        process.exit(1);
    });
});

// Timeout for dev server startup (e.g., 60 seconds)
const devTimeout = setTimeout(() => {
    console.error("Dev server did not start within 60 seconds");
    console.error("Dev server stderr output:", devStderr);
    treeKill(dev.pid, "SIGTERM", (err) => {
        if (err) {
            console.error("Failed to kill dev server:", err);
        }
        treeKill(test.pid, "SIGTERM", (err) => {
            if (err) {
                console.error("Failed to kill test process:", err);
            }
            process.exit(1);
        });
    });
}, 60000);

// Clear timeout if dev server starts successfully
dev.on("spawn", () => {
    console.log("Dev server spawned");
    clearTimeout(devTimeout);
});