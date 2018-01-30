/*
* @Author: lushijie
* @Date:   2018-01-30 10:13:15
* @Last Modified by:   lushijie
* @Last Modified time: 2018-01-30 10:13:46
*/
// rem-unit plugin sublime
// add <meta charset="utf-8" name="viewport" content="width=device-width"> in html
(function (doc, win) {
  function recalc () {
    // debug
    $('.debug').text('方向：' + win.orientation);

    var designWidth = 750; // 视觉图 750px, deviceWidth * dpr
    var standard = 100; // 基准 1rem = 100px
    var dpr = win.devicePixelRatio || 1;
    var scale = 1 / dpr;
    var docEl = doc.documentElement;

    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);

    // var deviceWidth1 = docEl.clientWidth;
    var deviceWidth = win.screen.width;
    if (win.orientation !== undefined) {
      // 横竖屏切换
      deviceWidth = win.screen[win.orientation === 0 ? 'width' : 'height'];
    }
    if (!deviceWidth) return;

    // 设置基准，设定最大值
    var rem = Math.min(deviceWidth * dpr * standard / designWidth, standard);

    // 设置viewport，进行缩放，达到高清效果
    var metaEl = doc.querySelector('meta[name="viewport"]');
    metaEl.setAttribute('content', 'width=' + dpr * deviceWidth +
      ',initial-scale=' + scale +
      ',maximum-scale=' + scale +
      ',minimum-scale=' + scale +
      ',user-scalable=no'
    );

    // 动态写入样式
    var styleEl = doc.createElement('style');
    docEl.firstElementChild.appendChild(styleEl);
    styleEl.innerHTML = 'html{font-size:' + rem + 'px!important;}'
    + 'body {font-size: ' + 30 + 'px!important;}';

    // 绑定关键参数到 window 对象
    win.deviceWidth = deviceWidth;
    win.dpr = dpr;
    win.rem = rem;

    // 给js调用的，某一dpr下rem和px之间的转换函数
    win.rem2px = function(v) {
      v = parseFloat(v);
      return v * rem;
    };
    win.px2rem = function(v) {
      v = parseFloat(v);
      return v / rem;
    };
  }

  // addEventListener
  if (!doc.addEventListener) return;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  win.addEventListener(resizeEvt, function() {
    setTimeout(function() {recalc()} , 200)
  }, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
