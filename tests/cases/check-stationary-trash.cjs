const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    for (const width of [1440, 390])
      for (const mode of ["symbols", "names", "both"]) {
        const p = await b.newPage({ locale: "pt-BR", viewport: { width, height: 1100 } }),
          errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.route("https://lp.test/**", (r) =>
          r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
        );
        await p.goto("https://lp.test");
        await p.waitForTimeout(700);
        await p.evaluate((mode) => {
          ui.roleDisplay = mode;
          root.dataset.roleDisplay = mode;
        }, mode);
        const row = p.locator("#rows>.hy-row").first();
        await row.hover();
        await p.waitForTimeout(250);
        async function metrics() {
          return row.evaluate((e) => {
            const trash = e.querySelector(".hy-delete-line"),
              role = e.querySelector(".hy-role"),
              box = (n) => {
                let r = n.getBoundingClientRect();
                return { x: r.x, y: r.y, width: r.width, height: r.height };
              };
            const t = box(trash),
              r = box(role),
              hits = [];
            for (let x = t.x + 2; x < r.x + r.width; x += 4) {
              let n = document.elementFromPoint(x, t.y + t.height / 2);
              hits.push(
                n?.closest(".hy-delete-line") === trash
                  ? "trash"
                  : n?.closest(".hy-role") === role
                    ? "role"
                    : "other",
              );
            }
            return { trash: t, role: r, hits, icon: box(trash.querySelector("svg")) };
          });
        }
        const before = await metrics();
        if (width === 1440 && mode === "symbols")
          await row.screenshot({ path: "test-artifacts/stationary-trash-normal.png" });
        await row.locator(".hy-role").click({ delay: 600 });
        await row.hover();
        await p.waitForTimeout(250);
        assert(await row.evaluate((e) => e.classList.contains("hy-blank-line")));
        const after = await metrics();
        assert.deepEqual(after, before, width + " " + mode);
        if (width === 1440 && mode === "symbols")
          await row.screenshot({ path: "test-artifacts/stationary-trash-blank.png" });
        const role = await row.locator(".hy-role").boundingBox();
        await p.mouse.click(role.x + 2, role.y + role.height / 2);
        assert.equal(await row.evaluate((e) => e.classList.contains("hy-blank-line")), false);
        await row.locator(".hy-role").click({ delay: 600 });
        await row.hover();
        await p.waitForTimeout(250);
        const trash = await row.locator(".hy-delete-line").boundingBox();
        await p.mouse.click(trash.x + 8, trash.y + trash.height / 2);
        assert((await p.locator("dialog:modal").count()) > 0, "trash click opens confirmation");
        assert.deepEqual(errors, []);
        console.log(
          width +
            " " +
            mode +
            ": fixed trash/icon, identical hit map and role box, restore and deletion PASS",
        );
        await p.close();
      }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
