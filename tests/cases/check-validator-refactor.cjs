const fs = require("fs"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const html = fs.readFileSync("index.html", "utf8"),
  source = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .find((s) => /scope\.LPLogic\s*=/.test(s));
const sandbox = { module: { exports: {} } };
vm.runInNewContext(source.slice(0, source.indexOf("})(globalThis);") + 15), sandbox);
const logic = sandbox.module.exports;
const row = (text, role = "premise") => ({ text, role });
(async () => {
  const cases = [
    { rows: [row("A → B"), row("A"), row("B", "conclusion")], status: "valid" },
    { rows: [row("A → B"), row("B"), row("A", "conclusion")], status: "invalid" },
    { rows: [row("A → B"), row("¬B"), row("¬A", "conclusion")], status: "valid" },
    { rows: [row("A"), row("¬A"), row("B", "conclusion")], status: "valid" },
    { rows: [row("A ∨ ¬A", "conclusion")], status: "valid" },
    { rows: [row("A", "conclusion")], status: "invalid" },
    { rows: [row("□A"), row("A", "conclusion")], status: "errors" },
    { rows: [row("∀x"), row("A", "conclusion")], status: "errors" },
    { rows: [row("A →"), row("B", "conclusion")], status: "errors" },
    { rows: [row("A")], status: "missingConclusion" },
    {
      rows: [
        row(Array.from({ length: 17 }, (_, i) => "P" + i).join(" ∧ ")),
        row("P0", "conclusion"),
      ],
      status: "limit",
    },
  ];
  for (const c of cases) {
    const result = await logic.validate(c.rows);
    assert.equal(result.status, c.status, JSON.stringify(c));
    if (result.status === "invalid") {
      const values = result.conclusions[0].counterexample;
      for (const r of c.rows.filter((r) => r.role === "premise"))
        assert.equal(logic.evaluate(logic.parse(r.text).tree, values), true);
      assert.equal(logic.evaluate(logic.parse(c.rows.at(-1).text).tree, values), false);
    }
  }
  let seed = 1234567;
  const random = (n) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % n;
    },
    operators = ["∧", "∨", "→", "↔", "⊕", "↑", "↓", "←", "↛"];
  function expr(depth) {
    if (!depth || random(4) === 0) {
      const key = ["A", "B", "C"][random(3)];
      return { text: key, evaluate: (v) => v[key] };
    }
    if (random(5) === 0) {
      const a = expr(depth - 1);
      return { text: "¬(" + a.text + ")", evaluate: (v) => !a.evaluate(v) };
    }
    const a = expr(depth - 1),
      b = expr(depth - 1),
      op = operators[random(operators.length)];
    return {
      text: "(" + a.text + " " + op + " " + b.text + ")",
      evaluate: (v) => {
        const x = a.evaluate(v),
          y = b.evaluate(v);
        switch (op) {
          case "∧":
            return x && y;
          case "∨":
            return x || y;
          case "→":
            return !x || y;
          case "↔":
            return x === y;
          case "⊕":
            return x !== y;
          case "↑":
            return !(x && y);
          case "↓":
            return !(x || y);
          case "←":
            return !y || x;
          case "↛":
            return x && !y;
        }
      },
    };
  }
  for (let i = 0; i < 250; i++) {
    const e = expr(4),
      tree = logic.parse(e.text).tree;
    for (let mask = 0; mask < 8; mask++) {
      const values = { A: !!(mask & 1), B: !!(mask & 2), C: !!(mask & 4) };
      assert.equal(logic.evaluate(tree, values), e.evaluate(values), e.text);
    }
  }
  console.log(
    "11 known validity/error/limit cases plus 250 generated formulas × 8 independent truth evaluations: OK",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
