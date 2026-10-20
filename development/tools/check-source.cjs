const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const acorn = require("acorn");
const postcss = require("postcss");
const root = path.resolve(__dirname, "../src");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const owners = new Map(),
  asts = [];
function bindings(pattern) {
  if (!pattern) return [];
  if (pattern.type === "Identifier") return [pattern.name];
  if (pattern.type === "ObjectPattern")
    return pattern.properties.flatMap((p) => bindings(p.value || p.argument));
  if (pattern.type === "ArrayPattern") return pattern.elements.flatMap(bindings);
  return bindings(pattern.argument || pattern.left);
}
function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) v.forEach((n) => walk(n, visit));
    else if (v && typeof v === "object") walk(v, visit);
  }
}
assert.equal(
  new Set(manifest.scripts.map((m) => m.file)).size,
  manifest.scripts.length,
  "Duplicate script entry",
);
for (const { file } of manifest.scripts) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  assert(!/<\/script/i.test(source), "Unsafe inline script terminator: " + file);
  const ast = acorn.parse(source, { ecmaVersion: "latest" });
  asts.push({ ast, file });
  for (const node of ast.body) {
    const names =
      node.type === "VariableDeclaration"
        ? node.declarations.flatMap((d) => bindings(d.id))
        : node.id
          ? [node.id.name]
          : [];
    for (const name of names) {
      assert(
        !owners.has(name),
        `Global binding ${name} duplicated in ${file} and ${owners.get(name)?.file}`,
      );
      owners.set(name, { file, function: node.type === "FunctionDeclaration" });
    }
  }
}
const controllerOwners = new Map(),
  viewOwners = new Map();
for (const { ast, file } of asts)
  walk(ast, (node) => {
    if (node.type === "CallExpression" && node.callee.name === "registerLogicView") {
      const name = node.arguments[0]?.value;
      assert(typeof name === "string", "Validation views need a stable literal name: " + file);
      assert(!viewOwners.has(name), "Duplicate validation view: " + name);
      viewOwners.set(name, file);
    }
    if (
      node.type === "AssignmentExpression" &&
      node.left.type === "MemberExpression" &&
      ["rowController", "symbolBehavior"].includes(node.left.object.name)
    ) {
      const key = node.left.object.name + "." + node.left.property.name;
      assert(!controllerOwners.has(key), "Controller callback has multiple owners: " + key);
      controllerOwners.set(key, file);
    }
    if (
      node.type === "AssignmentExpression" &&
      node.left.type === "Identifier" &&
      owners.get(node.left.name)?.function
    ) {
      assert.fail(
        `Do not replace ${node.left.name} in ${file}; use its explicit controller/view interface.`,
      );
    }
  });
const declarations = new Map();
for (const file of manifest.styles) {
  const css = postcss.parse(fs.readFileSync(path.join(root, file), "utf8"));
  css.walkRules((rule) => {
    const context = [];
    for (let p = rule.parent; p && p.type !== "root"; p = p.parent)
      if (p.type === "atrule") context.unshift("@" + p.name + " " + p.params);
    for (const selector of postcss.list.comma(rule.selector))
      for (const declaration of rule.nodes || []) {
        if (declaration.type !== "decl") continue;
        const key = context.join("|") + "|" + selector + "|" + declaration.prop;
        assert(
          !declarations.has(key),
          `Overlapping CSS declaration: ${key}; edit its existing definition instead.`,
        );
        declarations.set(key, file);
      }
  });
}
console.log(
  `Source checks passed: ${manifest.scripts.length} scripts, ${declarations.size} selector/property/context definitions; no global replacements or duplicate definitions.`,
);
