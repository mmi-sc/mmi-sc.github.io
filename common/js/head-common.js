// 各ページの <head> にベタ貼りされていた共通リンク群（フィード、wp-block-library
// 系の CSS、テーマ CSS、jQuery、favicon、Web フォント、共通 footer.js など）を
// document.write でまとめて出力する。
//
// `<title>` / Yoast SEO の og:* / JSON-LD などのページ固有 meta は別途
// `<head>` の先頭に手書きする。`headCommon()` の呼び出しはそれらの後に置くこと。
//
// 使い方:
//   <script src="/common/js/head-common.js"></script>
//   <script>headCommon();</script>                       // Elementor 不要のページ
//   <script>headCommon({ elementor: [{ id: 20, ver: 1620557812 }] });</script>
//
// elementor 配列は WP がページ毎に出力する `elementor-post-XX-css` を表す。
// 全 Elementor 使用ページで post-20 が共通で付き、ページ固有 post がその後ろに
// 1 個だけ追加されるパターンが確認されている。順番は WP オリジナルの出力順を
// 維持すること（CSS の上書き順に影響）。
function headCommon(opts) {
  opts = opts || {};
  var lines = [
    '<link rel="dns-prefetch" href="//s.w.org">',
    '<link rel="alternate" type="application/rss+xml" title="株式会社マン・マシンインターフェース &raquo; フィード" href="https://www.mmi-sc.co.jp/feed">',
    '<link rel="alternate" type="application/rss+xml" title="株式会社マン・マシンインターフェース &raquo; コメントフィード" href="https://www.mmi-sc.co.jp/comments/feed">',
    '<link rel="stylesheet" id="wp-block-library-css" href="/wp-includes/css/dist/block-library/style.min.css?ver=5.8" type="text/css" media="all">',
    '<link rel="stylesheet" id="contact-form-7-css" href="/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.1" type="text/css" media="all">',
    '<link rel="stylesheet" id="contact-form-7-confirm-css" href="/wp-content/plugins/contact-form-7-add-confirm/includes/css/styles.css?ver=5.1" type="text/css" media="all">',
    '<link rel="stylesheet" id="rnworks-style-css" href="/wp-content/themes/mmi/style.css?ver=5.8" type="text/css" media="all">',
  ];

  if (opts.elementor && opts.elementor.length) {
    lines.push(
      '<link rel="stylesheet" id="elementor-icons-css" href="/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css?ver=5.11.0" type="text/css" media="all">',
      '<link rel="stylesheet" id="elementor-animations-css" href="/wp-content/plugins/elementor/assets/lib/animations/animations.min.css?ver=3.2.2" type="text/css" media="all">',
      '<link rel="stylesheet" id="elementor-frontend-css" href="/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=3.2.2" type="text/css" media="all">'
    );
    for (var i = 0; i < opts.elementor.length; i++) {
      var p = opts.elementor[i];
      lines.push(
        '<link rel="stylesheet" id="elementor-post-' + p.id + '-css" href="/wp-content/uploads/elementor/css/post-' + p.id + '.css?ver=' + p.ver + '" type="text/css" media="all">'
      );
    }
    lines.push(
      '<link rel="stylesheet" id="google-fonts-1-css" href="https://fonts.googleapis.com/css?family=Roboto%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CRoboto+Slab%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&#038;display=auto&#038;ver=5.8" type="text/css" media="all">'
    );
  }

  lines.push(
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/jquery/jquery.min.js?ver=3.6.0" id="jquery-core-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2" id="jquery-migrate-js"></scr' + 'ipt>',
    '<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="/wp-includes/wlwmanifest.xml">',
    '<style type="text/css">.site-title,.site-description{position:absolute;clip:rect(1px,1px,1px,1px);}</style>',
    '<link rel="icon" href="/wp-content/uploads/2021/07/cropped-icon-32x32.png" sizes="32x32">',
    '<link rel="icon" href="/wp-content/uploads/2021/07/cropped-icon-192x192.png" sizes="192x192">',
    '<link rel="apple-touch-icon" href="/wp-content/uploads/2021/07/cropped-icon-180x180.png">',
    '<meta name="msapplication-TileImage" content="/wp-content/uploads/2021/07/cropped-icon-270x270.png">',
    '<link rel="stylesheet" type="text/css" href="/wp-content/themes/mmi/css/style.css?210817-0607">',
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">',
    '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
    '<link rel="stylesheet" type="text/css" href="/wp-content/themes/mmi/css/animate.min.css">',
    '<link rel="preconnect" href="https://fonts.gstatic.com/">',
    '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500&display=swap" rel="stylesheet">',
    '<scr' + 'ipt type="text/javascript" src="/common/js/footer.js"></scr' + 'ipt>'
  );

  document.write(lines.join(""));
}
