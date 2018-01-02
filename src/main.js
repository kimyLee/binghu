// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/* eslint-disable */
if (!Date.now)
Date.now = function() { return new Date().getTime(); };

/* eslint-disable */
(function() {
'use strict';

var vendors = ['webkit', 'moz'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                               || window[vp+'CancelRequestAnimationFrame']);
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function() { callback(lastTime = nextTime); },
                          nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
}
}());

window.requestAnimFrame = window.requestAnimationFrame

/* eslint-disable */
!(function(doc, win) {
  var docEle = doc.documentElement,
  evt = "onorientationchange" in window ? "orientationchange" : "resize",
  fn = function() {
      var width = docEle.clientWidth;
      width && (docEle.style.fontSize = 10 * (width / 320) + "px");
  };

  win.addEventListener(evt, fn, false);
  doc.addEventListener("DOMContentLoaded", fn, false);
}(document, window))

// Vue配置
Vue.config.productionTip = false
Vue.prototype.$domain = location.port.indexOf('8888') < 0 ? '/binghutiaozhan' : ''

Vue.filter('autoPre', (url) => {
  if (location.port.indexOf('8888') < 0) {
    return `/binghutiaozhan${url}`
  }
  return url
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
