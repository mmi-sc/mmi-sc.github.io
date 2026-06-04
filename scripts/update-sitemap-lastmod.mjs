// sitemap.xml の <lastmod> を各ページの git 最終コミット日に更新する。冪等。
//
// 使い方:
//   node scripts/update-sitemap-lastmod.mjs          # 全 <lastmod> を更新
//   node scripts/update-sitemap-lastmod.mjs --check  # 乖離があれば exit 1（CI 用）
//
// <loc> の URL からファイルパス（<path>/index.html）を解決し、
// `git log -1 --format=%cs -- <path>` の日付で <lastmod> を差し替える。

import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";

const ROOT = process.cwd();
const SITEMAP = join(ROOT, "sitemap.xml");
const ORIGIN = "https://www.mmi-sc.co.jp/";
const CHECK = process.argv.includes("--check");

const run = promisify(execFile);

async function lastCommitDate(path) {
  const { stdout } = await run("git", ["log", "-1", "--format=%cs", "--", path], { cwd: ROOT });
  return stdout.trim();
}

const xml = await readFile(SITEMAP, "utf8");
let next = xml;

for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if (!loc || !loc.startsWith(ORIGIN)) continue;

  const file = join(loc.slice(ORIGIN.length), "index.html").replaceAll("\\", "/");
  const date = await lastCommitDate(file);
  if (!date) {
    console.warn(`[skip] ${loc}: git 履歴が見つかりません (${file})`);
    continue;
  }

  const updated = block.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${date}</lastmod>`);
  if (updated !== block) {
    next = next.replace(block, updated);
    console.log(`[ok]   ${loc} -> ${date}`);
  }
}

if (next === xml) {
  console.log("[same] sitemap.xml は最新です");
} else if (CHECK) {
  console.error("[error] sitemap.xml の <lastmod> が実更新日と乖離しています。`npm run sitemap:lastmod` を実行してください。");
  process.exit(1);
} else {
  await writeFile(SITEMAP, next, "utf8");
  console.log("[done] sitemap.xml を更新しました");
}
