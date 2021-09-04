jQuery(window).on('load',function(){
    jQuery('body').removeClass('preload');
});

jQuery(window).on('load scroll', function(){
  var elem = jQuery('.animated');
  elem.each(function () {
    var isAnimate = jQuery(this).data('animate');
    var elemOffset = jQuery(this).offset().top;
    var scrollPos = jQuery(window).scrollTop();
    var wh = jQuery(window).height();
    if(scrollPos > elemOffset - wh){
      jQuery(this).addClass(isAnimate);
      jQuery(this).removeClass('invisible');
    }
  });
});
date = new Date();
thisYear = date.getFullYear();
document.getElementById("thisYear").innerHTML = thisYear;

// ドロップダウンメニュー
jQuery('.menu-item-has-children').hover(
  function() {
    //カーソルが重なった時
    jQuery(this).children('ul.sub-menu').addClass('open');
  }, function() {
    //カーソルが離れた時
    jQuery(this).children('ul.sub-menu').removeClass('open');
  }
);
 
// グローバルナビの開閉
jQuery(function($) {
  $('.nav-button-wrap').on('click', function() {
    if ($(this).hasClass('active')) {
      // スマホ用メニューが表示されていたとき
      $(this).removeClass('active');
      $('#navi').addClass('close');
      $('#navi, body').removeClass('open');
      $('#overlay').removeClass('active');
    } else {
      // スマホ用メニューが非表示の時
      $(this).addClass('active');
      $('#navi').removeClass('close');
      $('#navi, body').addClass('open');
      $('#overlay').addClass('active');
    }
  });
  $('#overlay').on('click', function() {
    if ($(this).hasClass('active')) {
      // スマホ用メニューが表示されていたとき
      $(this).removeClass('active');
      $('#navi').addClass('close');
      $('#navi, body').removeClass('open');
      $('.nav-button-wrap').removeClass('active');
    } else {
      // スマホ用メニューが非表示の時
      $(this).addClass('active');
      $('#navi').removeClass('close');
      $('#navi, body').addClass('open');
      $('.nav-button-wrap').addClass('active');
    }
  });
});