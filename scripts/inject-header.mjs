// 全 index.html に「静的ヘッダーHTML」を埋め込む。冪等。
//
// なぜこれが必要か:
//   かつてはヘッダーを JS（旧 common/js/header.js の document.write）で
//   生成していたが、AIクローラ（GPTBot, ClaudeBot, PerplexityBot 等）の
//   多くは JS をほぼ実行しないため、サイト構造の関係グラフが一切認識
//   されない状態になっていた。
//
// 解決策:
//   各 index.html の <body> 直後（lead-nurture トラッキングスクリプトの後ろ）
//   にある <!-- LLMO-HEADER:START --> 〜 <!-- LLMO-HEADER:END --> マーカー間を
//   このスクリプトで最新のヘッダーHTML（buildHeader() が唯一の定義）に
//   上書きする。<script src="/common/js/nav-active.js"></script> は残す
//   （location.pathname を見て current-menu-item クラスを付与する役目）。
//
// 使い方:
//   node scripts/inject-header.mjs          # 全 index.html を更新
//   node scripts/inject-header.mjs --check  # 乖離があれば exit 1（CI 用）
//
// 追加・削除した index.html はこのスクリプト内の FILES に手で追記する
// （format.mjs と同じ思想で、対象を明示する）。新規ページには上記の
// マーカーペアをあらかじめ書いておくこと。

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();

const MARK_START = "<!-- LLMO-HEADER:START -->";
const MARK_END   = "<!-- LLMO-HEADER:END -->";

// 対象 index.html とトップ判定（トップだけ社名タグを h1 にする）
const FILES = [
  { path: "index.html",                       isTop: true  },
  { path: "about/index.html",                 isTop: false },
  { path: "about/outline/index.html",         isTop: false },
  { path: "about/principle/index.html",       isTop: false },
  { path: "about/history/index.html",         isTop: false },
  { path: "about/access/index.html",          isTop: false },
  { path: "about/lduinfo/index.html",         isTop: false },
  { path: "about/privacy/index.html",         isTop: false },
  { path: "techinfo/index.html",              isTop: false },
  { path: "techinfo/ee-division/index.html",  isTop: false },
  { path: "techinfo/ss-division/index.html",  isTop: false },
  // techinfo/ps-division/index.html はトップへのリダイレクトのみのため対象外
  { path: "csr/index.html",                   isTop: false },
  { path: "csr/environment/index.html",       isTop: false },
  { path: "csr/sdgs/index.html",              isTop: false },
  { path: "recruit/index.html",               isTop: false },
];

function buildHeader({ isTop }) {
  const titleTag = isTop ? "h1" : "p";
  return [
    MARK_START,
    '<div id="page" class="site">',
    '  <header id="masthead" class="site-header">',
    '    <div class="page-width1200 pos-re">',
    '      <div class="site-branding">',
    '        <a href="/" class="custom-logo-link" rel="home">',
    '          <img src="/wp-content/uploads/2021/07/logo-n.svg" class="custom-logo" alt="株式会社マン・マシンインターフェース">',
    '        </a>',
    `        <${titleTag} class="site-title"><a href="/" rel="home">株式会社マン・マシンインターフェース</a></${titleTag}>`,
    '        <p class="site-description">人（MAN）と機械（MACHINE）をつなぐかけはし（INTERFACE）になる。私たちは、社名の由来でもあるこの志を胸に、日々ソフトウェアの開発・改良に取り組んでいます。</p>',
    '      </div>',
    '      <div class="nav-button-wrap">',
    '        <div class="nav-button"><span></span><span></span><span></span></div>',
    '      </div>',
    '      <nav id="navi" class="navi" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">',
    '        <div id="navi-in" class="navi-in">',
    '          <ul class="flex jcc">',
    '            <li id="menu-item-15" class="nav-top menu-item menu-item-type-custom menu-item-object-custom menu-item-15"><a href="/">トップページ</a></li>',
    '            <li id="menu-item-88" class="nav-company menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-88">',
    '              <a href="/about/">企業情報</a>',
    '              <ul class="sub-menu">',
    '                <li id="menu-item-277" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-277">',
    '                  <a href="/about/">企業情報</a>',
    '                  <ul class="sub-menu">',
    '                    <li id="menu-item-93" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-93"><a href="/about/outline/">会社概要</a></li>',
    '                    <li id="menu-item-92" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-92"><a href="/about/principle/">企業方針</a></li>',
    '                    <li id="menu-item-91" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-91"><a href="/about/history/">沿革</a></li>',
    '                    <li id="menu-item-90" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-90"><a href="/about/access/">アクセス</a></li>',
    '                  </ul>',
    '                </li>',
    '                <li id="menu-item-89" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-89"><a href="/about/lduinfo/">公開情報</a></li>',
    '                <li id="menu-item-98" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-98"><a href="/about/privacy/">プライバシーポリシー</a></li>',
    '              </ul>',
    '            </li>',
    '            <li id="menu-item-97" class="nav-techinfo menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-97">',
    '              <a href="/techinfo/">技術情報</a>',
    '              <ul class="sub-menu">',
    '                <li id="menu-item-476" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-476">',
    '                  <a href="/techinfo/">技術情報</a>',
    '                  <ul class="sub-menu">',
    '                    <li id="menu-item-475" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-475"><a href="/techinfo/ee-division/">組込みエンジニアリング</a></li>',
    '                    <li id="menu-item-642" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-642"><a href="/techinfo/ss-division/">SIソリューション</a></li>',
    '                  </ul>',
    '                </li>',
    '              </ul>',
    '            </li>',
    '            <li id="menu-item-95" class="nav-eco menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-95">',
    '              <a href="/csr/">社会貢献</a>',
    '              <ul class="sub-menu">',
    '                <li id="menu-item-278" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-278"><a href="/csr/">社会貢献</a></li>',
    '                <li id="menu-item-96" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-96"><a href="/csr/environment/">環境方針</a></li>',
    '                <li id="menu-item-1153" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1153"><a href="/csr/sdgs/">SDGs</a></li>',
    '              </ul>',
    '            </li>',
    '            <li id="menu-item-94" class="nav-jobs menu-item menu-item-type-post_type menu-item-object-page menu-item-94"><a href="/recruit/">採用情報</a></li>',
    '          </ul>',
    '          <div class="drawer-logo"><a href="/" class="custom-logo-link" rel="home">',
    '            <img src="/wp-content/uploads/2021/07/logo-n.svg" class="custom-logo" alt="株式会社マン・マシンインターフェース">',
    '          </a></div>',
    '        </div>',
    '      </nav>',
    '      <div class="pickup-navi">',
    '        <ul>',
    '          <li id="menu-item-100" class="navpick-support menu-item menu-item-type-post_type menu-item-object-page menu-item-100"><a href="https://forms.office.com/r/XypstJFU8R">お問い合わせ</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '  </header>',
    '  <div id="overlay"></div>',
    '  <div id="content" class="site-content">',
    MARK_END,
  ].join("\n");
}

// マーカー間置換用
const MARKER_BLOCK_RE = new RegExp(
  MARK_START.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") +
    "[\\s\\S]*?" +
    MARK_END.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
);

async function processFile(file) {
  const full = join(ROOT, file.path);
  let html = await readFile(full, "utf8");
  const header = buildHeader({ isTop: file.isTop });

  let changed = false;

  if (MARKER_BLOCK_RE.test(html)) {
    // マーカー間を上書き
    const next = html.replace(MARKER_BLOCK_RE, header);
    if (next !== html) {
      html = next;
      changed = true;
    }
  } else {
    console.warn(`[skip] ${file.path}: マーカーが見つかりません`);
    return;
  }

  if (changed) {
    await writeFile(full, html, "utf8");
    console.log(`[ok]   ${file.path}`);
  } else {
    console.log(`[same] ${file.path}`);
  }
}

for (const f of FILES) {
  try {
    await processFile(f);
  } catch (e) {
    console.error(`[err]  ${f.path}: ${e.message}`);
  }
}
