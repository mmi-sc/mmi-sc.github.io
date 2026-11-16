// アクセシビリティ対応の共通スクリプト（全ページ）。
// footer-scripts.js からテーマの common.js の後に読み込む。
//
// - スマホ用メニューボタンの開閉状態を aria-expanded に反映し、Esc キーで閉じられるようにする
// - 新しいタブで開くリンクに、読み上げ用の「（新しいタブで開きます）」を付ける
(function () {
  // ---- スマホ用メニューボタン ----
  // 開閉はテーマの common.js が .nav-button-wrap の active クラスで行うため、
  // クラスの変化を監視して aria-expanded を合わせる。
  var navButton = document.querySelector(".nav-button-wrap");
  if (navButton) {
    var sync = function () {
      navButton.setAttribute("aria-expanded", navButton.classList.contains("active") ? "true" : "false");
    };
    sync();
    new MutationObserver(sync).observe(navButton, {
      attributes: true,
      attributeFilter: ["class"]
    });

    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && navButton.classList.contains("active")) {
        navButton.click();
        navButton.focus();
      }
    });
  }

  // ---- 新しいタブで開くリンク ----
  var NOTE = "（新しいタブで開きます）";
  var links = document.querySelectorAll('a[target="_blank"]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    var label = a.getAttribute("aria-label");
    if (label) {
      if (label.indexOf(NOTE) === -1) a.setAttribute("aria-label", label + NOTE);
    } else if (!a.querySelector(".a11y-newtab")) {
      var span = document.createElement("span");
      span.className = "screen-reader-text a11y-newtab";
      span.textContent = NOTE;
      a.appendChild(span);
    }
  }
})();
