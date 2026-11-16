// 採用 FAQ ページ（/recruit/faq/）のキーワード検索と対象絞り込み。
//
// Q&A 本文は HTML に静的に書いてあり、このスクリプトは表示・非表示を切り替えるだけ。
// JS が無効でも全項目が読める（検索欄は hidden のまま表示されない）。
//
// - キーワード: 質問と回答の本文を対象に、空白区切りの全語を含むものを表示（AND 検索）。
//   全角/半角・大文字/小文字・ひらがな/カタカナの違いは無視する。
// - 対象: 「新卒採用」「キャリア採用」を選ぶと、その対象と「共通」の質問を表示する。
// - URL の #faq-XX で開いたときは、その質問を開いた状態で表示する。
(function () {
  var root = document.querySelector(".faq");
  if (!root) return;

  var tools = root.querySelector(".faq-tools");
  var input = root.querySelector(".faq-search__input");
  var buttons = root.querySelectorAll(".faq-filter__btn");
  var countEl = root.querySelector(".faq-count");
  var emptyEl = root.querySelector(".faq-empty");
  var categories = root.querySelectorAll(".faq-category");
  var items = root.querySelectorAll(".faq-item");
  var filter = "all";

  function normalize(s) {
    s = (s || "").normalize ? s.normalize("NFKC") : s;
    return s.toLowerCase().replace(/[ァ-ヶ]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x60);
    });
  }

  // 検索対象テキストとハイライト用の元 HTML を保持
  var data = [];
  for (var i = 0; i < items.length; i++) {
    var textEl = items[i].querySelector(".faq-item__text");
    data.push({
      el: items[i],
      textEl: textEl,
      html: textEl.innerHTML,
      search: normalize(items[i].textContent),
      target: items[i].getAttribute("data-target"),
    });
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(d, words) {
    if (!words.length) {
      d.textEl.innerHTML = d.html;
      return;
    }
    var re = new RegExp("(" + words.map(escapeRegExp).join("|") + ")", "gi");
    d.textEl.innerHTML = d.html.replace(re, "<mark>$1</mark>");
  }

  function apply() {
    var q = input.value.trim();
    var words = q ? normalize(q).split(/\s+/) : [];
    var rawWords = q ? q.split(/\s+/) : [];
    var shown = 0;

    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var okTarget = filter === "all" || d.target === "common" || d.target === filter;
      var okWords = true;
      for (var w = 0; w < words.length; w++) {
        if (d.search.indexOf(words[w]) === -1) {
          okWords = false;
          break;
        }
      }
      var visible = okTarget && okWords;
      d.el.hidden = !visible;
      if (visible) shown++;
      highlight(d, visible ? rawWords : []);
    }

    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      var any = cat.querySelector(".faq-item:not([hidden])");
      cat.hidden = !any;
      var link = root.querySelector('.faq-index a[href="#' + cat.id + '"]');
      if (link) link.parentElement.hidden = !any;
    }

    emptyEl.hidden = shown !== 0;
    countEl.textContent = q || filter !== "all" ?
      shown + "件の質問が見つかりました" :
      "全" + data.length + "件";
  }

  var timer;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(apply, 150);
  });

  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener("click", function () {
      filter = this.getAttribute("data-filter");
      for (var k = 0; k < buttons.length; k++) {
        buttons[k].setAttribute("aria-pressed", buttons[k] === this ? "true" : "false");
      }
      apply();
    });
  }

  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!/^faq-\d+$/.test(id)) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      el.scrollIntoView();
    }
  }

  tools.hidden = false;
  apply();
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
