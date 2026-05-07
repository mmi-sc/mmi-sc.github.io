// 各ページ末尾にベタ貼りされていた共通スクリプト群
// （noscript フォールバック表示 + jQuery / contact-form-7 関連 / テーマ JS）を
// document.write でまとめて出力する。`</body>` の直前で
// `<script src="/common/js/footer-scripts.js"></script>` として読み込むこと。
//
// Elementor を使うページではこのスクリプトの後ろに elementor 固有の
// `<script>` 群（webpack.runtime / frontend-modules / waypoints / swiper /
// elementorFrontendConfig など）が続く。それらは各ページに残してある。
(function () {
  document.write(
    '<noscript>',
    '<div id="noscript">',
    '<div class="noscript-box">',
    '<p><img src="/wp-content/themes/mmi/images/logo.png" alt="株式会社マン・マシンインターフェース"></p>',
    "<p>Javascript が無効に設定されています。<br>Javascript を有効にして頂き、当サイトをお楽しみください。</p>",
    "</div>",
    "</div>",
    "</noscript>",
    // jQuery 3.6.0 は <head> で /wp-includes/js/jquery/jquery.min.js を
    // 同じバージョンでローカル読み込み済みなので、CDN 版は重複につき省略。
    '<scr' + 'ipt type="text/javascript" src="/wp-content/themes/mmi/js/common.js?210817-0607"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/dist/vendor/regenerator-runtime.min.js?ver=0.13.7" id="regenerator-runtime-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0" id="wp-polyfill-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" id="contact-form-7-js-extra">',
    "/* <![CDATA[ */",
    'var wpcf7 = {"api":{"root":"https:\\/\\/www.mmi-sc.co.jp\\/wp-json\\/","namespace":"contact-form-7\\/v1"}};',
    "/* ]]> */",
    "</scr" + "ipt>",
    '<scr' + 'ipt type="text/javascript" src="/wp-content/plugins/contact-form-7/includes/js/index.js?ver=5.4.1" id="contact-form-7-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/jquery/jquery.form.min.js?ver=4.2.1" id="jquery-form-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-content/plugins/contact-form-7-add-confirm/includes/js/scripts.js?ver=5.1" id="contact-form-7-confirm-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-content/themes/mmi/js/navigation.js?ver=20151215" id="rnworks-navigation-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-content/themes/mmi/js/skip-link-focus-fix.js?ver=20151215" id="rnworks-skip-link-focus-fix-js"></scr' + 'ipt>',
    '<scr' + 'ipt type="text/javascript" src="/wp-includes/js/wp-embed.min.js?ver=5.8" id="wp-embed-js"></scr' + 'ipt>'
  );
})();
