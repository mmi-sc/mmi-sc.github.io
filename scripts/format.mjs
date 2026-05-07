import { readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, extname, sep } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const jsbeautify = require("js-beautify");

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "wp-includes",
  "feed",
  "comments",
  "scripts",
]);

const IGNORE_PATHS = [
  "wp-content/plugins",
  "wp-content/uploads",
  "wp-content/themes/mmi/css/animate.min.css",
  "wp-content/themes/mmi/style.css",
].map((p) => p.split("/").join(sep));

const ROOT = process.cwd();
const config = JSON.parse(readFileSync(".jsbeautifyrc", "utf8"));

function configFor(ext) {
  const base = { ...config };
  delete base.html;
  delete base.css;
  delete base.js;
  if (ext === ".html") return { ...base, ...(config.html || {}) };
  if (ext === ".css") return { ...base, ...(config.css || {}) };
  if (ext === ".js") return { ...base, ...(config.js || {}) };
  return null;
}

function isIgnored(rel) {
  const top = rel.split(sep)[0];
  if (IGNORE_DIRS.has(top)) return true;
  for (const p of IGNORE_PATHS) {
    if (rel === p || rel.startsWith(p + sep)) return true;
  }
  return false;
}

async function* walk(dir, root = dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, ent.name);
    const rel = abs.slice(root.length + 1);
    if (ent.isDirectory()) {
      if (isIgnored(rel)) continue;
      yield* walk(abs, root);
    } else if (ent.isFile()) {
      if (isIgnored(rel)) continue;
      yield rel;
    }
  }
}

const beautifiers = {
  ".html": jsbeautify.html,
  ".css": jsbeautify.css,
  ".js": jsbeautify.js,
};

const checkOnly = process.argv.includes("--check");
const unformatted = [];
let formatted = 0;

for await (const rel of walk(ROOT)) {
  const ext = extname(rel).toLowerCase();
  const beautify = beautifiers[ext];
  if (!beautify) continue;
  const cfg = configFor(ext);
  const src = readFileSync(rel, "utf8");
  const out = beautify(src, cfg);
  const normalized = out.endsWith("\n") ? out : out + "\n";
  if (normalized !== src) {
    if (checkOnly) {
      unformatted.push(rel);
    } else {
      writeFileSync(rel, normalized, "utf8");
      console.log("formatted:", rel);
      formatted++;
    }
  }
}

if (checkOnly) {
  if (unformatted.length) {
    console.log("Files needing format:");
    for (const f of unformatted) console.log("  " + f);
    process.exit(1);
  } else {
    console.log("All files are formatted.");
  }
} else {
  console.log(`Done. ${formatted} file(s) formatted.`);
}
