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
  function prepare(rows, { maxAtoms = 128 } = {}) {
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
    if (atoms.length > maxAtoms || entries.length > 200) return { status: "limit", atoms: atoms.length };
    return { status: "ready", atoms, premises, conclusions };
  }
  // Tseitin encoding followed by bounded, cooperative DPLL. A limit is never UNSAT.
  async function solveSAT(trees, { cancelled = () => false, yieldTask = () => Promise.resolve(), maxMs = 2000, maxOperations = 4000000 } = {}) {
    const started = Date.now(), ids = new Map(), clauses = [], cache = new WeakMap();
    let variables = 0, operations = 0;
    const fresh = () => { if (++variables > 30000) throw Error('sat-limit'); return variables; };
    function encode(node) {
      if (cache.has(node)) return cache.get(node);
      if (node.op === 'atom') { if (!ids.has(node.value)) ids.set(node.value, fresh()); return ids.get(node.value); }
      const v = fresh(); cache.set(node, v);
      if (node.op === 'constant') clauses.push([node.value ? v : -v]);
      else {
        const a = encode(node.left);
        if (node.op === 'not') clauses.push([-v,-a],[v,a]);
        else {
          const b = encode(node.right);
          for (const x of [false,true]) for (const y of [false,true]) {
            const output = evaluate({ op:node.op, left:{op:'constant',value:x}, right:{op:'constant',value:y} }, {});
            clauses.push([x ? -a : a, y ? -b : b, output ? v : -v]);
          }
        }
      }
      if (clauses.length > 100000) throw Error('sat-limit');
      return v;
    }
    try { for (const tree of trees) clauses.push([encode(tree)]); }
    catch (_) { return { status:'unknown', reason:'limit' }; }
    const scores = new Uint32Array(variables+1);
    for (const clause of clauses) for (const literal of clause) scores[Math.abs(literal)]++;
    const stack = [new Int8Array(variables+1)];
    while (stack.length) {
      if (cancelled()) return { status:'cancelled' };
      if (Date.now()-started > maxMs || operations > maxOperations) return { status:'unknown', reason:'limit' };
      const values = stack.pop(); let conflict = false, changed = true, allSatisfied = false;
      while (changed && !conflict) {
        changed = false; allSatisfied = true;
        for (const clause of clauses) {
          let satisfied = false, missing = 0, unit = 0;
          for (const literal of clause) {
            const value = values[Math.abs(literal)];
            if (value && (value > 0) === (literal > 0)) { satisfied = true; break; }
            if (!value) { missing++; unit = literal; }
          }
          if (!satisfied) {
            allSatisfied = false;
            if (!missing) { conflict = true; break; }
            if (missing === 1) {
              const id = Math.abs(unit), value = unit > 0 ? 1 : -1;
              if (values[id] && values[id] !== value) { conflict = true; break; }
              if (!values[id]) { values[id] = value; changed = true; }
            }
          }
          if ((++operations & 8191) === 0) {
            if (cancelled()) return { status:'cancelled' };
            if (Date.now()-started > maxMs || operations > maxOperations) return { status:'unknown', reason:'limit' };
            await yieldTask();
          }
        }
      }
      if (conflict) continue;
      if (allSatisfied) {
        const model = Object.create(null);
        for (const [name,id] of ids) model[name] = values[id] > 0;
        return { status:'sat', model, operations };
      }
      let selected = 0;
      for (let id=1;id<=variables;id++) if (!values[id] && (!selected || scores[id]>scores[selected])) selected=id;
      if (!selected) return { status:'unknown', reason:'internal' };
      const alternative = values.slice(); alternative[selected] = -1; values[selected] = 1;
      stack.push(alternative,values);
      if ((operations & 255) === 0) await yieldTask();
    }
    return { status:'unsat', operations };
  }
  async function validateSAT(prepared, options) {
    const { atoms,premises,conclusions } = prepared, base = premises.map(e=>e.tree), results = [];
    const deadline=Date.now()+options.maxMs;
    const consistency = await solveSAT(base,options);
    if (consistency.status === 'cancelled') return { status:'cancelled' };
    let unknown = consistency.status === 'unknown';
    for (const entry of conclusions) {
      if(Date.now()>=deadline)return {status:'limit',method:'sat',atoms:atoms.length,partial:results};
      const result = consistency.status === 'unsat' ? consistency : await solveSAT([...base,{op:'not',left:entry.tree}],{...options,maxMs:Math.max(1,deadline-Date.now())});
      if (result.status === 'cancelled') return { status:'cancelled' };
      if (result.status === 'unknown') unknown = true;
      if (result.status === 'sat' && (!base.every(tree=>evaluate(tree,result.model)) || evaluate(entry.tree,result.model))) return { status:'limit' };
      const model = result.model && Object.fromEntries(atoms.map(atom=>[atom,Boolean(result.model[atom])]));
      results.push({ index:entry.index, valid:result.status==='unsat'?true:result.status==='sat'?false:null, counterexample:model||null });
    }
    // Partial verdicts are retained but never presented as a completed decision.
    if (unknown) return { status:'limit', method:'sat', atoms:atoms.length, partial:results };
    return {status:results.some(e=>!e.valid)?'invalid':'valid',satisfiable:consistency.status==='sat',atoms,premiseCount:premises.length,conclusions:results,method:'sat'};
  }
  async function validate(
    rows,
    { cancelled = () => false, yieldTask = () => Promise.resolve(), forceSAT = false, maxMs = 2000, maxOperations = 4000000 } = {},
  ) {
    const prepared = prepare(rows);
    if (prepared.status !== "ready") return prepared;
    if (forceSAT || prepared.atoms.length > 16) return validateSAT(prepared, {cancelled,yieldTask,maxMs,maxOperations});
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
  scope.LPLogic = { parse, evaluate, prepare, validate, solveSAT };
  if (typeof module !== "undefined") module.exports = scope.LPLogic;
})(globalThis);
