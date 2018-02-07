<template>
  <div id="app">
    <router-view :my-audio = "myAudio" @showteach="teach = true"/>
    <audio id="cheer" :src="'/static/audio/cheer.mp3' | autoPre" preload></audio>
    <audio id="fail" :src="'/static/audio/fail.mp3' | autoPre" preload></audio>
    <audio id="brush" :src="'/static/audio/brush.mp3' | autoPre" preload></audio>
    <!-- 玩法教程 -->
    <my-dialog height="25" :open="teach" @closeDialog="teach = false" class="dialog">
      <span slot="title">玩法教程</span>
      <div class="swiper-container" id="swiperContainer">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in introItem" :key="index">
              <div class="imgHover">
                  <img class="slide-img" :src="item.img | autoPre">
              </div>
             <div class="text-field">
              <span class="red-slogn"></span>
              <p>{{item.text}}</p>
             </div>
          </div>

        </div>
      </div>
        <div style="width: 100%;position:relative;text-align: center;">
            <div class="dots-panel">
              <span class="dots" v-for="i in 5" :key="i" :class="{'active': (i - 1) === swiper.activeIndex}"></span>
            </div>
        </div>
    </my-dialog>
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
  data () {
    return {
      teach: false,       // 玩法教程弹框
      swiper: '',                          // 滑动容器
      introItem: [
        {img: '/static/images/intro1.jpg', text: '1、出发时力度直接影响冰壶滑行距离，劲太大可能会与终点擦肩而过哦'},
        {img: '/static/images/intro2.jpg', text: '2、方向选的准更容易获得高分，方向选定点击滑行即可开始调整'},
        {img: '/static/images/intro3.jpg', text: '3、扫冰可让冰面更光滑，增加冰壶滑行距离'},
        {img: '/static/images/intro4.jpg', text: '4、通过左右扫冰会让冰壶向对应方向滑动，调整冰壶保持最佳路线是成功的关键'},
        {img: '/static/images/intro5.jpg', text: '5、冰壶一旦碰壁本局游戏结束，再次挑战争取更好成绩'}
      ],
      myAudio: {
        cheer: '',
        fail: '',
        brush: ''
      }
    }
  },
  components: {
    myDialog
  },
  watch: {
    'teach' () {
      this.$nextTick(() => {
        if (!this.swiper) {
          let Swiper = window.Swiper
          this.swiper = new Swiper('#swiperContainer')
        }
      })
    }
  },
  mounted () {
    let that = this
    document.addEventListener('DOMContentLoaded', () => {
      that.audioAutoPlay = (target) => {
        let successMusic = document.getElementById('cheer')
        successMusic.play()
        let failmusic = document.getElementById('fail')
        failmusic.play()
        setTimeout(() => {
          successMusic.pause()
          failmusic.pause()
        }, 10)
        document.addEventListener('WeixinJSBridgeReady', () => {
          let successMusic = document.getElementById('cheer')
          successMusic.play()
          let failmusic = document.getElementById('fail')
          failmusic.play()
          setTimeout(() => {
            successMusic.pause()
            failmusic.pause()
          }, 10)
        }, false)
      }
      that.audioAutoPlay()
    })
    this.$nextTick(() => {
      for (let ele in this.myAudio) {
        this.myAudio[ele] = document.getElementById(ele)
      }
    })
  },
  methods: {
    // 创建音频
    // createAudio () {
    //   let myAudio = this.myAudio
    //   for (let ele in myAudio) {
    //     myAudio[ele] = document.createElement('AUDIO')
    //     myAudio[ele].src = this.$domain + `/static/audio/${ele}.mp3`
    //     myAudio[ele].preload = true
    //     // if (ele === 'brush') {
    //     //   myAudio[ele].loop = true
    //     // }
    //   }
    // }
  }
}
</script>

<style lang="scss">
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
  user-select: none;
  
}

.imgHover {
    width: 70%;
    text-align: center;
    max-height: 25.5rem;
    left: 15%;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .slide-img {
      width: 100%;
       display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
       display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
}
.text-field {
  width: 85%;
  left: 10%;
  margin-top: 1.6rem;
  box-sizing: border-box;
  position: relative;
  // text-align: center;
  .red-slogn {
      background: #d84247;
      position: absolute;
      left: 0;
      margin-left: -2rem;
      width: 0.8rem;
      height: 1.6rem;
      display: inline-block;
      transform: skew(-10deg);
    }
    p {
      text-align: left;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
  
}
.dots-panel {
      display: inline-block;
      // margin-left: 0rem;
      .dots {
        display: inline-block;
        margin-right: 0.7rem;
        width: 0.6rem;
        height: 0.6rem;
        background: #d84247;
        border-radius: 50%;
        // box-shadow: 0px 0px 2px 2px #bbb;
        border: 2px solid #e5e5e5;
        &.active {
          width: 0.8rem;
          height: 0.8rem;
          position: relative;
          top: 0.1rem;
        }
      }
    }


@media (min-height: 690px) {
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
