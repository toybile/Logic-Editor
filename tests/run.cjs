const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
process.chdir(path.resolve(__dirname, ".."));
fs.mkdirSync("test-artifacts", { recursive: true });
const requested = process.argv.slice(2);
const cases = requested.length ? requested : require("./cases.json");
const results = [];
let next = 0;
async function worker() {
  while (next < cases.length) {
    const name = cases[next++];
    if (!/^[a-z0-9-]+$/.test(name)) throw new Error("Invalid test name: " + name);
    await new Promise((resolve) => {
      const started = Date.now();
      const child = spawn(process.execPath, ["tests/cases/" + name + ".cjs"], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      let output = "",
        timedOut = false;
      child.stdout.on("data", (d) => (output += d));
      child.stderr.on("data", (d) => (output += d));
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill();
      }, 90000);
      child.on("error", (e) => (output += e.stack));
      child.on("close", (code) => {
        clearTimeout(timer);
        const passed = code === 0 && !timedOut;
        results.push({ name, passed, code, timedOut, elapsedMs: Date.now() - started, output });
        fs.writeFileSync("test-artifacts/results.json", JSON.stringify(results, null, 2) + "\n");
        console.log(
          `${passed ? "PASS" : "FAIL"} ${name}${passed ? "" : "\n" + output.slice(-2200)}`,
        );
        resolve();
      });
    });
  }
}
Promise.all(Array.from({ length: Math.min(3, cases.length) }, worker))
  .then(() => {
    const failed = results.filter((r) => !r.passed);
    console.log(`${results.length - failed.length}/${results.length} suites passed.`);
    if (failed.length) process.exitCode = 1;
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
