<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import myDialog from '@/components/dialog'
export default {
  name: 'app',
  components: {
    myDialog
  }
}
</script>

<style>
html {
  font-size: 62.5%;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-text-size-adjust: 100%;
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-shadow: rgba(0, 0, 0, .01) 0 0 1px;
}

#app {
  font-family: 'PingFang SC', 'Microsoft Yahei', STHeitiSC-Light, Helvetica-Light, arial, sans-serif;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
