// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

window.requestAnimFrame = (() => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 30)
    }
})()

Vue.config.productionTip = false

Vue.filter('autoPre', (url) => {
  if (location.port.indexOf('8888') < 0) {
    return `/binghutiaozhan${url}?20171220`
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
