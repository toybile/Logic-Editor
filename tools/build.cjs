// Generates a self-contained distribution. Run: node build.cjs [output.html]
// Sources are classic scripts in manifest order; their shared browser scope is intentional.
const fs = require("node:fs");
const path = require("node:path");
const base = path.resolve(__dirname, "../src");
const manifest = JSON.parse(fs.readFileSync(path.join(base, "manifest.json"), "utf8"));
const read = (file) => fs.readFileSync(path.join(base, file), "utf8").trim();
const styles = manifest.styles.map(read).join("\n\n");
const scripts = manifest.scripts
  .map(({ name, file }) => `<script id="${name}">\n${read(file)}\n</script>`)
  .join("\n\n");
let html = read("template.html");
for (const marker of ["APP_STYLES", "APP_SCRIPTS"]) {
  if (html.split(`<!-- ${marker} -->`).length !== 2)
    throw new Error(`Expected one ${marker} marker`);
}
html =
  html
    .replace("<!-- APP_STYLES -->", () => `<style id="app-styles">\n${styles}\n</style>`)
    .replace("<!-- APP_SCRIPTS -->", () => scripts) + "\n";
html = html.replace(
  /<!doctype html>/i,
  () =>
    "<!doctype html>\n<!-- Edit the sources and run build.cjs; direct edits here may be overwritten. -->",
);
if (!/^<!doctype html>/i.test(html)) {
  throw new Error("The distribution must start with the HTML5 doctype.");
}
const output = path.resolve(process.argv[2] || path.join(base, "../index.html"));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
console.log(`Built ${output} (${Buffer.byteLength(html)} bytes)`);
