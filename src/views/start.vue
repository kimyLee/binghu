<template>
  <div class="start-page">
    <!-- loading -->
    <div class="loading" v-show="loading">
       <svg class="loading-cycle" style="margin-top: -3rem;" width="80" height="30" viewBox="0 0 120 30" fill="#d35155">
          <circle cx="15" cy="15" r="13.748">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="60" cy="15" r="10.252" fill-opacity="0.3">
              <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
              <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="105" cy="15" r="13.748">
              <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
              <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
      </svg>
    </div>
    <!-- 预加载 -->
    <div class="loading" v-show="curProgress < 100">
      <div class="loading-cycle">
        <svg :width="60" :height="60" class="loading-svg">
        <circle :cx="30" :cy="30" :r="20" stroke-width="10" stroke="#fed744" fill="none"></circle>
        <circle :cx="30" :cy="30" :r="20" stroke-width="10" stroke="#d35155" fill="none"  :stroke-dasharray="circleDasharray"></circle>
        </svg>
        <br>
        {{curProgress}}%
      </div>
    </div>
    <!-- 主页面 -->
    <div v-show="curProgress >= 100">
      <!-- logo 和 游戏规则 -->
      <div class="logo" @click="$emit('showteach')">
        <img :src="'/static/images/introBtn.png' | autoPre" />
      </div>
      <div class="game-rule" @click="seeRule=true">
        <img :src="'/static/images/rule.png' | autoPre" />
      </div>

      <div class="bg-box">
        <img class="img-bg" :src="'/static/images/homeBg.png' | autoPre" />
      </div>
      <!-- 开始游戏按钮 -->
      <div class="btn-field">
        <span class="start-btn"  @click="startGame">
          <img :src="'/static/images/btn.png' | autoPre"/>
        </span>
      </div>
      <!-- 游戏协议 -->
      <div class="game-protocol">
        <label>
          <input type="checkbox" class="game-checkbox" v-model="hasCheck" @change="setHasCheck"/>
          <span class="checkbox-select">{{hasCheck ? '&#10003;': ''}}</span>
        </label>
        <span class="game-protocol-btn" @click="seeProtocol=true">查看游戏声明</span>
      </div>
    </div>

    <!-- 游戏规则说明 -->
    <my-dialog :open="seeRule" @closeDialog="seeRule = false" height="15">
      <img slot="title" :src="'/static/images/game_rule.png' | autoPre" />
      <div class="" style="font-size: 1.2rem;font-weight: bold">
        <br>
        每周参与冰壶挑战，赢取积分大奖。<br><br>
        1、每日首次完成游戏挑战（单局离终点5m以内）可获得1-5积分随机奖励，积分奖励每日仅限1次<br><br>
        2、每周全国游戏排名前1-3名可额外奖励999积分，4-10名奖励300积分每周全国游戏排名前1-3名奖励999积分，4-10名奖励300积分，11-50名奖励100分，51-100名奖励50积分
      </div>
    </my-dialog>
    <!-- 查看游戏声明 -->
    <my-dialog :open="seeProtocol" @closeDialog="seeProtocol = false" height="22">
       <img slot="title" :src="'/static/images/shengming.png' | autoPre" />
        <div class=""  style="font-size: 1.2rem;font-weight: bold">
        1、本活动内容仅用于零售户学习了解新红万产品特点，以便更好地为消费者介绍产品，不得用于商业用途。<br><br>
        2、请勿复制、转发、分享或以其他任何方式传播此平台上的内容，对于违反本条款或法律法规而引起的一切责任，由用户负全部责任，与本平台无关；导致本平台受到损失的，本平台有权要求用户赔偿。<br><br>
        3、所有活动参与者均须接受活动免责条款。<br><br>
        此活动最终解释权归菲莫精英汇所有。
        </div>
    </my-dialog>
    <!-- 请先阅读游戏声明 -->
    <my-dialog :open="seeTip" @closeDialog="seeTip = false" height="2">
       <span slot="title" >提示</span>
        <div style="text-align: center;">
          <b>请先阅读游戏声明</b>
        </div>
    </my-dialog>

    
  </div>
</template>

<script>
import axios from 'axios'
import myDialog from '@/components/dialog'
export default {
  name: 'app',
  components: {
    myDialog
  },
  data () {
    return {
      globalId: '',
      // teach: false,       // 玩法教程弹框
      loading: false,                     // 是否正在加载
      afterLoadNum: 0,                    // 后台加载是否完成
      circleDasharray: 0,
      curProgress: 0,                     // 当前用来计算圆环进度的参数，会预先赋值30%
      progress: 0,                        // 实际进度
      notLoadImgCount: 0,
      imgToalCount: 0,
      hasCheck: false,                    // 是否勾选游戏协议
      seeTip: false,                      // 是否打开警告弹窗
      seeRule: false,                     // 是否打开游戏规则弹窗
      seeProtocol: false                 // 是否打开游戏声明弹窗
      // swiper: '',                          // 滑动容器
      // introItem: [
      //   {img: '/static/images/intro1.jpg', text: '1、出发时力度直接影响冰壶滑行距离，劲太大可能会与终点擦肩而过哦'},
      //   {img: '/static/images/intro2.jpg', text: '2、方向选的准更容易获得高分，方向选定点击滑行即可开始调整'},
      //   {img: '/static/images/intro3.jpg', text: '3、扫冰可让冰面更光滑，增加冰壶滑行距离'},
      //   {img: '/static/images/intro4.jpg', text: '4、通过左右扫冰会让冰壶向对应方向滑动，调整冰壶保持最佳路线是成功的关键'},
      //   {img: '/static/images/intro5.jpg', text: '5、冰壶一旦碰壁本局游戏结束，再次挑战争取更好成绩'}
      // ]
    }
  },
  created () {
    this.preLoad()
    this.hasCheck = !!(localStorage.getItem('hasCheck') - 0)
  },

  mounted () {
    this.$nextTick(() => {
      this.transionTarget()
      this.fetchData()
    })
  },

  beforeRouteLeave (to, from, next) {
    let count = 0
    let cycleCheck = () => {
      if (this.afterLoadNum > 0 && count < 10) {
        count++
        this.loading = true
        setTimeout(cycleCheck, 100)
      } else {
        this.loading = false
        next()
      }
    }
    cycleCheck()
  },

  watch: {
    'notLoadImgCount' () {
      this.progress = 100 - Math.round(this.notLoadImgCount / this.imgToalCount * 100)
    }
    // 'teach' () {
    //   this.$nextTick(() => {
    //     if (!this.swiper) {
    //       this.swiper = new Swiper('#swiperContainer')
    //     }
    //   })
    // }
  },
  methods: {
    // 获取用户信息和排行榜数据
    fetchData () {
      axios.post('/Index/SystemStatue')
        .then((result) => {
          let res = result.data
          if (res.Code === 1) {
            let data = res.Data
            this.globalId = data.EliteId
            if (window.zhuge) {
              window.zhuge.identify(this.globalId)
              window.zhuge.track('用户' + this.globalId + '进入了首页')
            }
          } else {
            return Promise.reject(res)
          }
        })
        .catch((error) => {
          console.log(error)
          // this.msgText = error.msg || '未知错误'
          // this.msgTip = true
        })
      console.log('fetching data...')
    },
    // 顺滑过渡 progress ，会通过计算属性模拟transition到达
    transionTarget () {
      if (this.curProgress >= 100) {
        this.afterLoad()
        return
      }
      let time = this.curProgress < this.progress ? 5 : 30
      if (this.curProgress < Math.max(30, this.progress)) {
        this.curProgress++
      } else {
        this.curProgress = Math.max(30, this.progress)
      }
      this.circleDasharray = Math.round(this.curProgress / 100 * 2 * Math.PI * 20) + ' 1069'
      setTimeout(() => {
        this.transionTarget()
      }, time)
    },

    // 存储状态
    setHasCheck () {
      localStorage.setItem('hasCheck', this.hasCheck ? 1 : 0)
    },

    startGame () {
      if (!this.hasCheck) {
        this.seeTip = true
        // alert('请先阅读游戏声明')
        return
      }
      this.$router.push({name: 'word'})
      if (window.zhuge) {
        window.zhuge.track('用户' + this.globalId + '点击了开始游戏')
      }
    },
    // 预加载
    preLoad () {
      let imgs = [
        // this.$domain + '/static/images/logo.png',
        this.$domain + '/static/images/rule.png',
        this.$domain + '/static/images/homeBg.png',
        this.$domain + '/static/images/game_rule.png',
        this.$domain + '/static/images/shengming.png',
        this.$domain + '/static/images/intro1.jpg',
        this.$domain + '/static/images/intro2.jpg',
        this.$domain + '/static/images/intro3.jpg',
        this.$domain + '/static/images/intro4.jpg',
        this.$domain + '/static/images/intro5.jpg',
        this.$domain + '/static/images/introBtn.png',
        this.$domain + '/static/images/btn.png'
      ]
      this.imgToalCount = imgs.length
      this.notLoadImgCount = imgs.length
      imgs.forEach(e => {
        let img = new Image()
        img.src = e
        img.onload = () => {
          this.notLoadImgCount--
        }
        img.onerror = () => {
          this.notLoadImgCount--
        }
      })
    },
    afterLoad () {
      let imgs = [
        this.$domain + '/static/images/binghu.png',
        this.$domain + '/static/images/brush.png',
        this.$domain + '/static/images/people.jpg',
        this.$domain + '/static/images/people2.jpg',
        this.$domain + '/static/images/bg-ad.png',
        this.$domain + '/static/images/follower.png',
        this.$domain + '/static/images/newMeter.jpg',
        this.$domain + '/static/images/btn-bg.png',
        this.$domain + '/static/images/moreSmooth.png',
        this.$domain + '/static/images/rank.png',
        this.$domain + '/static/images/victory.png',
        this.$domain + '/static/images/failed.png',
        this.$domain + '/static/images/game-intro.png',
        this.$domain + '/static/images/again.png',
        this.$domain + '/static/images/outcycle.png',
        this.$domain + '/static/images/power-btn.png',
        this.$domain + '/static/images/finger.png'
        // this.$domain + '/static/images/test.jpg'
      ]
      this.afterLoadNum = imgs.length
      imgs.forEach(e => {
        let img = new Image()
        img.src = e
        img.onload = () => {
          this.afterLoadNum--
        }
        img.onerror = () => {
          this.afterLoadNum--
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .start-page {
    background: #fff;
    position: relative;

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

    .loading {
      position: fixed;
      background: #fff;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 999;
      text-align: center;
      .loading-cycle {
        position: relative;
        top: 50%;
        margin-top: -1.5rem;
      }
      .loading-svg {
        display: inline-block;
        transform-origin: center;
        transform-box: fill-box;
        transform: rotate(-90deg);
        cycle {
          transition: all .4s ease;
        }
      }
    }
    .logo {
      position: absolute;
      top: 1.5rem;
      left: 2.7rem;
      width: 9.5rem;
      z-index: 10;
      img {
        width: 100%;
      }
    }
    .game-rule {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 9.5rem;
      z-index: 10;
      img {
        width: 100%;
      }
    }
    .bg-box {
      position: relative;
      .img-bg {
        width: 100%;
      }
    }

    .btn-field {
      text-align: center;
      margin-top: 1.5rem;
      .start-btn {
        display: inline-block;
        width: 23.5rem;
        height: 7rem;
        img {
          width: 23.5rem;
        }
        /* // background: url('../assets/btn.png') no-repeat;
        // background-size: 100%; */
      }
    }
    .game-protocol {
      text-align: center;
      label {
        display: inline-block;
        cursor: pointer;
      }

      label input[type='checkbox'] {
        outline: none;
        border: 0;
        appearance: none;
        outline: none;
        display:none;
        vertical-align: middle;
      }

      label input[type='checkbox'] + span {
        width: 2.3rem;
        height: 2.3rem;
        border: 1px solid #ccc;
        display: inline-block;
        background: #eee;
        background: linear-gradient(to top, #f1f0f0, #fefefe);
      }

      label input[type='checkbox']:checked + span {
        font-size: 2.4rem;
        line-height: 2.3rem;
        // background: #f00;
      }

      .game-protocol-btn {
        width: 12.5rem;
        color: #444;
        padding: .5rem;
        margin-left: 10px;
        vertical-align: top;
        display: inline-block;
        border: 1px solid #ccc;
        background: linear-gradient(to top, #f1f0f0, #fefefe);
        box-shadow: 0 0 2px #ccc;
      }
    }


  }
</style>
