<template>
  <div id="app">
    <router-view :my-audio = "myAudio"/>
  </div>
</template>

<script>
import myDialog from '@/components/dialog'
// let myAudio = {
//   cheer: '',
//   fail: '',
//   brush: ''
// }
export default {
  name: 'app',
  components: {
    myDialog
  },
  data () {
    return {
      myAudio: {
        cheer: '',
        fail: '',
        brush: ''
      }
    }
  },
  created () {
    this.createAudio()
  },
  methods: {
    // 创建音频
    createAudio () {
      let myAudio = this.myAudio
      for (let ele in myAudio) {
        myAudio[ele] = document.createElement('AUDIO')
        myAudio[ele].src = this.$domain + `/static/audio/${ele}.mp3`
        myAudio[ele].preload = true
        // if (ele === 'brush') {
        //   myAudio[ele].loop = true
        // }
      }
    }
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
@media (min-height: 668px) {
  body {
    background: #973134;
  }
  #app {
    height: 667px;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
  }
}
</style>
