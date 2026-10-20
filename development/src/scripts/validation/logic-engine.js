(function (scope) {
  const operators = {
    "¬": "not",
    "∼": "not",
    "~": "not",
    "!": "not",
    "∧": "and",
    "&": "and",
    "•": "and",
    "∨": "or",
    "+": "or",
    "→": "implies",
    "⇒": "implies",
    "⊃": "implies",
    "->": "implies",
    "←": "reverse",
    "⇐": "reverse",
    "<-": "reverse",
    "↔": "iff",
    "⇔": "iff",
    "≡": "iff",
    "<->": "iff",
    "⊕": "xor",
    "⊻": "xor",
    "↑": "nand",
    "⊼": "nand",
    "|": "nand",
    "↓": "nor",
    "⊽": "nor",
    "↛": "notImplies",
    "⇏": "notImplies",
    "↮": "xor",
    "⇎": "xor",
  };
  const precedence = {
    iff: 1,
    implies: 2,
    reverse: 2,
    notImplies: 2,
    or: 3,
    xor: 3,
    nor: 3,
    and: 4,
    nand: 4,
  };
  const pairs = { "(": ")", "[": "]", "{": "}" };
  Object.setPrototypeOf(operators, null);
  Object.setPrototypeOf(pairs, null);
  class FormulaError extends Error {
    constructor(code, column, token = "") {
      super(code);
      this.code = code;
      this.column = column;
      this.token = token;
    }
  }
  function parse(text) {
    if (text.length > 10000) throw new FormulaError("limit", 1);
    const tokens = [];
    let cursor = 0;
    while (cursor < text.length) {
      if (/\s/u.test(text[cursor])) {
        cursor++;
        continue;
      }
      const start = cursor;
      const alias = ["<->", "->", "<-"].find((v) => text.startsWith(v, cursor));
      const name = text.slice(cursor).match(/^[\p{L}_][\p{L}\p{M}\p{N}_′']*/u);
      const value = alias || name?.[0] || String.fromCodePoint(text.codePointAt(cursor));
      cursor += value.length;
      if (
        !operators[value] &&
        !pairs[value] &&
        !Object.values(pairs).includes(value) &&
        !name &&
        !["⊤", "⊥"].includes(value)
      )
        throw new FormulaError("unsupported", start + 1, value);
      tokens.push({ value, column: start + 1 });
      if (tokens.length > 1024) throw new FormulaError("limit", start + 1);
    }
    let index = 0;
    const atoms = new Set();
    function expression(minimum = 0, depth = 0) {
      if (depth > 128) throw new FormulaError("limit", tokens[index]?.column || text.length + 1);
      const token = tokens[index++];
      if (!token) throw new FormulaError("operand", text.length + 1);
      const value = token.value;
      let left;
      if (operators[value] === "not") left = { op: "not", left: expression(5, depth + 1) };
      else if (pairs[value]) {
        left = expression(0, depth + 1);
        const close = tokens[index++];
        if (close?.value !== pairs[value])
          throw new FormulaError("delimiter", close?.column || text.length + 1, pairs[value]);
      } else if (operators[value] || Object.values(pairs).includes(value))
        throw new FormulaError("operand", token.column, value);
      else if (value === "⊤" || value === "⊥") left = { op: "constant", value: value === "⊤" };
      else {
        atoms.add(value);
        left = { op: "atom", value };
      }
      while (index < tokens.length) {
        const op = operators[tokens[index].value],
          level = precedence[op];
        if (level === undefined || level < minimum) break;
        index++;
        const right = expression(
          ["implies", "reverse", "notImplies"].includes(op) ? level : level + 1,
          depth + 1,
        );
        left = { op, left, right };
      }
      return left;
    }
    const tree = expression();
    if (index < tokens.length)
      throw new FormulaError("operator", tokens[index].column, tokens[index].value);
    return { tree, atoms: [...atoms] };
  }
  function evaluate(node, values) {
    if (node.op === "atom") return values[node.value];
    if (node.op === "constant") return node.value;
    const a = evaluate(node.left, values);
    if (node.op === "not") return !a;
    const b = evaluate(node.right, values);
    switch (node.op) {
      case "and":
        return a && b;
      case "or":
        return a || b;
      case "implies":
        return !a || b;
      case "reverse":
        return !b || a;
      case "iff":
        return a === b;
      case "xor":
        return a !== b;
      case "nand":
        return !(a && b);
      case "nor":
        return !(a || b);
      case "notImplies":
        return a && !b;
    }
  }
  function prepare(rows) {
    const entries = [],
      errors = [];
    rows.forEach((row, index) => {
      if (row.role === "blank" || !row.text.trim()) return;
      try {
        entries.push({ index, role: row.role, ...parse(row.text) });
      } catch (error) {
        errors.push({
          index,
          code: error.code || "limit",
          column: error.column || 1,
          token: error.token || "",
        });
      }
    });
    if (errors.length) return { status: "errors", errors };
    const conclusions = entries.filter((e) => e.role === "conclusion"),
      premises = entries.filter((e) => e.role === "premise");
    if (!conclusions.length) return { status: "missingConclusion" };
    const atoms = [...new Set(entries.flatMap((e) => e.atoms))].sort();
    if (atoms.length > 16 || entries.length > 200) return { status: "limit", atoms: atoms.length };
    return { status: "ready", atoms, premises, conclusions };
  }
  async function validate(
    rows,
    { cancelled = () => false, yieldTask = () => Promise.resolve() } = {},
  ) {
    const prepared = prepare(rows);
    if (prepared.status !== "ready") return prepared;
    const { atoms, premises, conclusions } = prepared,
      failures = new Map();
    let satisfiable = false;
    for (let mask = 0; mask < 2 ** atoms.length; mask++) {
      if (mask % 256 === 0) {
        if (cancelled()) return { status: "cancelled" };
        await yieldTask();
        if (cancelled()) return { status: "cancelled" };
      }
      const values = Object.create(null);
      atoms.forEach((atom, index) => (values[atom] = Boolean(mask & (2 ** index))));
      if (!premises.every((e) => evaluate(e.tree, values))) continue;
      satisfiable = true;
      for (const entry of conclusions)
        if (!failures.has(entry.index) && !evaluate(entry.tree, values))
          failures.set(entry.index, { ...values });
      if (failures.size === conclusions.length) break;
    }
    return {
      status: failures.size ? "invalid" : "valid",
      satisfiable,
      atoms,
      premiseCount: premises.length,
      conclusions: conclusions.map((e) => ({
        index: e.index,
        valid: !failures.has(e.index),
        counterexample: failures.get(e.index) || null,
      })),
    };
  }
  scope.LPLogic = { parse, evaluate, prepare, validate };
  if (typeof module !== "undefined") module.exports = scope.LPLogic;
})(globalThis);
