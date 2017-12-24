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
      <div class="logo">
        <img :src="'/static/images/logo.png' | autoPre" />
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
      <div class="results-content">
        1. 力度条不断变化，待力度合适时点击滑行，滑出冰壶<br>
        2. 冰壶滑行过程中，力度会不断衰减，冰壶速度也越来越慢，左右扫冰可降低力度衰减速率，同时冰壶向对应方向偏离<br>
        3. 当力度降至为零，冰壶停止运动，或者冰壶接触滑道两边时，游戏结束<br>
        4. 游戏结束是冰壶离终点距离为最终分数，距离越近分数越高，所得积分也越高<br>
        5. 玩家凭借积分可····
      </div>
    </my-dialog>
    <!-- 查看游戏声明 -->
    <my-dialog :open="seeProtocol" @closeDialog="seeProtocol = false" height="2">
       <img slot="title" :src="'/static/images/shengming.png' | autoPre" />
        <div class="results-content">
          1. 本次积分只在活动期间有效<br>
          2. 活动方保留最终解释权
        </div>
    </my-dialog>
  </div>
</template>

<script>
import myDialog from '@/components/dialog'
export default {
  name: 'app',
  components: {
    myDialog
  },
  data () {
    return {
      loading: false,                     // 是否正在加载
      afterLoadNum: 0,                    // 后台加载是否完成
      circleDasharray: 0,
      curProgress: 0,                     // 当前用来计算圆环进度的参数，会预先赋值30%
      progress: 0,                        // 实际进度
      notLoadImgCount: 0,
      imgToalCount: 0,
      hasCheck: false,                    // 是否勾选游戏协议
      seeRule: false,                     // 是否打开游戏规则弹窗
      seeProtocol: false                  // 是否打开游戏声明弹窗
    }
  },
  created () {
    this.preLoad()
    this.hasCheck = !!(localStorage.getItem('hasCheck') - 0)
  },

  mounted () {
    this.$nextTick(() => {
      this.transionTarget()
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
  },
  methods: {
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
        alert('请先阅读游戏声明')
        return
      }
      this.$router.push({name: 'word'})
    },
    // 预加载
    preLoad () {
      let imgs = [
        this.$domain + '/static/images/logo.png',
        this.$domain + '/static/images/rule.png',
        this.$domain + '/static/images/homeBg.png',
        this.$domain + '/static/images/game_rule.png',
        this.$domain + '/static/images/shengming.png',
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
        this.$domain + '/static/images/meter.jpg'
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
      top: 1.8rem;
      left: 2.7rem;
      width: 7.5rem;
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
