<template>
  <div id="app">
    <my-dialog></my-dialog>
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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
