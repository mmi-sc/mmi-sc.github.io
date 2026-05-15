// header.js が出力したマストヘッド内のリンクを見て、現在ページに該当する
// `<a>` に aria-current="page" を、その親 `<li>` 群に WordPress 由来の
// current-menu-item / current-menu-ancestor / current_page_item クラスを
// 付与する。`<script>header()</script>` の直後に同期スクリプトとして
// 読み込むこと。
(function () {
  function normalize(p) {
    if (!p) return "/";
    p = p.split("?")[0].split("#")[0];
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.substring(0, p.length - 1);
    return p || "/";
  }

  var current = normalize(location.pathname);
  var anchors = document.querySelectorAll('#masthead a[href]');

  for (var i = 0; i < anchors.length; i++) {
    var a = anchors[i];
    var href = a.getAttribute("href");
    if (!href || /^([a-z]+:|\/\/|#|javascript:|mailto:)/i.test(href)) continue;

    if (normalize(href) !== current) continue;

    a.setAttribute("aria-current", "page");

    var li = a.parentElement;
    while (li && li.tagName !== "LI") li = li.parentElement;

    var isFirst = true;
    while (li) {
      if (isFirst) {
        li.classList.add("current-menu-item");
        li.classList.add("current_page_item");
      } else {
        li.classList.add("current-menu-ancestor");
      }
      isFirst = false;
      var p = li.parentElement;
      while (p && p.tagName !== "LI") p = p.parentElement;
      li = p;
    }
  }
})();
